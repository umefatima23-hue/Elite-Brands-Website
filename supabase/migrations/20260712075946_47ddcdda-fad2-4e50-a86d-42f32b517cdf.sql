
-- =====================================================================
-- 1. CUSTOMERS
-- =====================================================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  phone TEXT,
  status public.customer_status NOT NULL DEFAULT 'active',
  marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  internal_notes TEXT,
  lifetime_orders_count INTEGER NOT NULL DEFAULT 0,
  lifetime_spend NUMERIC(14,2) NOT NULL DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  loyalty_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT customers_full_name_not_empty CHECK (length(trim(full_name)) > 0),
  CONSTRAINT customers_email_format CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT customers_lifetime_orders_nonneg CHECK (lifetime_orders_count >= 0),
  CONSTRAINT customers_lifetime_spend_nonneg CHECK (lifetime_spend >= 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage customers" ON public.customers
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Customers view self" ON public.customers
  FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "Customers update self" ON public.customers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "Only super_admin hard delete customers" ON public.customers
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_customers_email ON public.customers (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX idx_customers_whatsapp ON public.customers (whatsapp) WHERE whatsapp IS NOT NULL;
CREATE INDEX idx_customers_phone ON public.customers (phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_customers_status ON public.customers (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_name_trgm ON public.customers USING gin (full_name gin_trgm_ops);
CREATE INDEX idx_customers_auth_user ON public.customers (auth_user_id) WHERE auth_user_id IS NOT NULL;

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 2. CUSTOMER ADDRESSES
-- =====================================================================
CREATE TABLE public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label TEXT,
  recipient_name TEXT NOT NULL,
  phone TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  province TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'PK',
  address_type public.address_type NOT NULL DEFAULT 'both',
  is_default_shipping BOOLEAN NOT NULL DEFAULT false,
  is_default_billing BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT addr_recipient_not_empty CHECK (length(trim(recipient_name)) > 0),
  CONSTRAINT addr_line1_not_empty CHECK (length(trim(line1)) > 0),
  CONSTRAINT addr_city_not_empty CHECK (length(trim(city)) > 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;
GRANT ALL ON public.customer_addresses TO service_role;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage addresses" ON public.customer_addresses
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Customers manage own addresses" ON public.customer_addresses
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.auth_user_id = auth.uid()));
CREATE POLICY "Only super_admin hard delete addresses" ON public.customer_addresses
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(),'super_admin')
    OR EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.auth_user_id = auth.uid())
  );

CREATE INDEX idx_addr_customer ON public.customer_addresses (customer_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_addr_default_shipping ON public.customer_addresses (customer_id)
  WHERE is_default_shipping = true AND deleted_at IS NULL;
CREATE UNIQUE INDEX ux_addr_default_billing ON public.customer_addresses (customer_id)
  WHERE is_default_billing = true AND deleted_at IS NULL;

CREATE TRIGGER trg_addr_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 3. ORDER NUMBER SEQUENCE + GENERATOR
-- =====================================================================
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 100000 INCREMENT 1;
GRANT USAGE ON SEQUENCE public.order_number_seq TO authenticated;
GRANT ALL ON SEQUENCE public.order_number_seq TO service_role;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN 'EB-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
END; $$;

-- =====================================================================
-- 4. ORDERS
-- =====================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT public.generate_order_number(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status public.order_status NOT NULL DEFAULT 'draft',
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  shipping_address_id UUID REFERENCES public.customer_addresses(id) ON DELETE SET NULL,
  billing_address_id UUID REFERENCES public.customer_addresses(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  payment_method public.payment_method NOT NULL DEFAULT 'cod',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  is_cod BOOLEAN NOT NULL DEFAULT true,
  currency TEXT NOT NULL DEFAULT 'PKR',
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  shipping_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  customer_notes TEXT,
  internal_notes TEXT,
  cancellation_reason TEXT,
  return_reason TEXT,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  confirmed_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT orders_totals_nonneg CHECK (
    subtotal >= 0 AND discount_total >= 0 AND shipping_total >= 0
    AND tax_total >= 0 AND grand_total >= 0
  ),
  CONSTRAINT orders_currency_len CHECK (length(currency) = 3)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.auth_user_id = auth.uid()));
CREATE POLICY "Only super_admin hard delete orders" ON public.orders
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_orders_customer ON public.orders (customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_status ON public.orders (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_payment_status ON public.orders (payment_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX idx_orders_confirmed_at ON public.orders (confirmed_at DESC) WHERE confirmed_at IS NOT NULL;
CREATE INDEX idx_orders_contact_phone ON public.orders (contact_phone) WHERE contact_phone IS NOT NULL;
CREATE INDEX idx_orders_contact_whatsapp ON public.orders (contact_whatsapp) WHERE contact_whatsapp IS NOT NULL;
CREATE INDEX idx_orders_contact_email ON public.orders (lower(contact_email)) WHERE contact_email IS NOT NULL;
CREATE INDEX idx_orders_order_number_trgm ON public.orders USING gin (order_number gin_trgm_ops);
CREATE INDEX idx_orders_warehouse ON public.orders (warehouse_id) WHERE warehouse_id IS NOT NULL;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 5. ORDER ITEMS
-- =====================================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  sku_snapshot TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  variant_name_snapshot TEXT,
  brand_snapshot TEXT,
  image_snapshot TEXT,
  attributes_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(14,2) NOT NULL,
  reservation_id UUID REFERENCES public.stock_reservations(id) ON DELETE SET NULL,
  inventory_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT oi_qty_positive CHECK (quantity > 0),
  CONSTRAINT oi_unit_price_nonneg CHECK (unit_price >= 0),
  CONSTRAINT oi_discount_nonneg CHECK (discount_amount >= 0),
  CONSTRAINT oi_tax_nonneg CHECK (tax_amount >= 0),
  CONSTRAINT oi_line_total_nonneg CHECK (line_total >= 0),
  CONSTRAINT oi_sku_snapshot_not_empty CHECK (length(trim(sku_snapshot)) > 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage order items" ON public.order_items
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Customers view own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE o.id = order_id AND c.auth_user_id = auth.uid()
  ));
CREATE POLICY "Only super_admin hard delete order items" ON public.order_items
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_oi_order ON public.order_items (order_id);
CREATE INDEX idx_oi_product ON public.order_items (product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_oi_variant ON public.order_items (variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX idx_oi_sku ON public.order_items (sku_snapshot);

CREATE TRIGGER trg_oi_updated_at
  BEFORE UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 6. ORDER EVENTS (append-only timeline)
-- =====================================================================
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  from_status public.order_status,
  to_status public.order_status,
  message TEXT,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT oe_type_not_empty CHECK (length(trim(event_type)) > 0)
);

GRANT SELECT, INSERT ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view events" ON public.order_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert events" ON public.order_events
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Customers view own non-internal events" ON public.order_events
  FOR SELECT TO authenticated
  USING (
    is_internal = false AND EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.customers c ON c.id = o.customer_id
      WHERE o.id = order_id AND c.auth_user_id = auth.uid()
    )
  );
CREATE POLICY "Only super_admin modify events" ON public.order_events
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Only super_admin delete events" ON public.order_events
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_oe_order ON public.order_events (order_id, created_at DESC);
CREATE INDEX idx_oe_type ON public.order_events (event_type);

-- =====================================================================
-- 7. INVENTORY INTEGRATION
-- =====================================================================
CREATE OR REPLACE FUNCTION public.default_warehouse_id()
RETURNS UUID LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT id FROM public.warehouses
   WHERE deleted_at IS NULL
     AND (is_default = true OR code = 'MAIN')
   ORDER BY (is_default = true) DESC, (code = 'MAIN') DESC, created_at ASC
   LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.orders_apply_inventory_transition()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  it RECORD;
  wh UUID;
  new_res UUID;
  new_balance NUMERIC;
BEGIN
  IF TG_OP <> 'UPDATE' OR OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  wh := coalesce(NEW.warehouse_id, public.default_warehouse_id());

  -- CONFIRMED: create reservations
  IF NEW.status = 'confirmed' THEN
    IF wh IS NULL THEN RAISE EXCEPTION 'No warehouse configured for inventory reservation.'; END IF;
    FOR it IN SELECT * FROM public.order_items WHERE order_id = NEW.id LOOP
      IF it.variant_id IS NULL THEN CONTINUE; END IF;
      INSERT INTO public.stock_reservations
        (variant_id, warehouse_id, qty, reference_type, reference_id, status, created_by)
      VALUES (it.variant_id, wh, it.quantity, 'order', NEW.id, 'active', auth.uid())
      RETURNING id INTO new_res;
      UPDATE public.order_items SET reservation_id = new_res WHERE id = it.id;
      UPDATE public.inventory
         SET reserved_qty = reserved_qty + it.quantity
       WHERE variant_id = it.variant_id AND warehouse_id = wh;
    END LOOP;
    NEW.confirmed_at := coalesce(NEW.confirmed_at, now());
  END IF;

  -- DISPATCHED: post outbound ledger + decrement on-hand + fulfil reservations
  IF NEW.status = 'dispatched' THEN
    IF wh IS NULL THEN RAISE EXCEPTION 'No warehouse configured for inventory dispatch.'; END IF;
    FOR it IN SELECT * FROM public.order_items WHERE order_id = NEW.id LOOP
      IF it.variant_id IS NULL THEN CONTINUE; END IF;
      UPDATE public.inventory
         SET on_hand_qty  = on_hand_qty - it.quantity,
             reserved_qty = GREATEST(reserved_qty - it.quantity, 0),
             last_movement_at = now()
       WHERE variant_id = it.variant_id AND warehouse_id = wh
       RETURNING on_hand_qty INTO new_balance;

      INSERT INTO public.inventory_ledger
        (variant_id, warehouse_id, movement_type, qty_delta, balance_after,
         reference_type, reference_id, notes, created_by)
      VALUES (it.variant_id, wh, 'sale_out', -it.quantity, coalesce(new_balance, 0),
              'order', NEW.id, 'Order dispatched', auth.uid());

      IF it.reservation_id IS NOT NULL THEN
        UPDATE public.stock_reservations
           SET status = 'fulfilled', fulfilled_at = now()
         WHERE id = it.reservation_id;
      END IF;
    END LOOP;
    NEW.dispatched_at := coalesce(NEW.dispatched_at, now());
  END IF;

  -- CANCELLED: release reservations if not yet shipped
  IF NEW.status = 'cancelled' THEN
    IF OLD.status NOT IN ('dispatched','delivered') THEN
      FOR it IN
        SELECT r.* FROM public.stock_reservations r
        WHERE r.reference_type = 'order' AND r.reference_id = NEW.id AND r.status = 'active'
      LOOP
        UPDATE public.inventory
           SET reserved_qty = GREATEST(reserved_qty - it.qty, 0)
         WHERE variant_id = it.variant_id AND warehouse_id = it.warehouse_id;
      END LOOP;
      UPDATE public.stock_reservations
         SET status = 'released', released_at = now()
       WHERE reference_type = 'order' AND reference_id = NEW.id AND status = 'active';
    END IF;
    NEW.cancelled_at := coalesce(NEW.cancelled_at, now());
  END IF;

  -- Milestone timestamps
  IF NEW.status = 'packing'            THEN NEW.packed_at    := coalesce(NEW.packed_at, now()); END IF;
  IF NEW.status = 'delivered'          THEN NEW.delivered_at := coalesce(NEW.delivered_at, now()); END IF;
  IF NEW.status = 'returned'           THEN NEW.returned_at  := coalesce(NEW.returned_at, now()); END IF;
  IF NEW.status = 'refunded'           THEN NEW.refunded_at  := coalesce(NEW.refunded_at, now()); END IF;

  -- Timeline entry
  INSERT INTO public.order_events (order_id, event_type, from_status, to_status, actor_id)
  VALUES (NEW.id, 'status_changed', OLD.status, NEW.status, auth.uid());

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.orders_apply_inventory_transition() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_orders_inventory_transition
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_apply_inventory_transition();

-- =====================================================================
-- 8. CUSTOMER LIFETIME AGGREGATES
-- =====================================================================
CREATE OR REPLACE FUNCTION public.customers_recalc_aggregates(_customer_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.customers c
     SET lifetime_orders_count = COALESCE(x.cnt, 0),
         lifetime_spend        = COALESCE(x.spend, 0),
         last_order_at         = x.last_at
    FROM (
      SELECT COUNT(*) AS cnt,
             SUM(grand_total) AS spend,
             MAX(created_at) AS last_at
        FROM public.orders
       WHERE customer_id = _customer_id
         AND status IN ('confirmed','packing','ready_to_dispatch','dispatched','delivered')
         AND deleted_at IS NULL
    ) x
   WHERE c.id = _customer_id;
END; $$;
REVOKE EXECUTE ON FUNCTION public.customers_recalc_aggregates(UUID) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.orders_after_change_recalc()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.customers_recalc_aggregates(OLD.customer_id);
    RETURN OLD;
  END IF;
  PERFORM public.customers_recalc_aggregates(NEW.customer_id);
  IF TG_OP = 'UPDATE' AND OLD.customer_id IS DISTINCT FROM NEW.customer_id THEN
    PERFORM public.customers_recalc_aggregates(OLD.customer_id);
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.orders_after_change_recalc() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_orders_recalc_customer
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_after_change_recalc();
