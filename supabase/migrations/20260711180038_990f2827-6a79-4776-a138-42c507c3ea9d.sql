
-- =========================================================================
-- Migration 05 — Inventory Intelligence (V1.0)
-- =========================================================================

-- ---------- Enums ----------
DO $$ BEGIN
  CREATE TYPE public.movement_type AS ENUM (
    'purchase_in','sale_out','return_in','return_out',
    'adjustment_in','adjustment_out','transfer_in','transfer_out',
    'reservation','release','damage','loss','correction','opening_stock'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.reservation_status AS ENUM ('active','fulfilled','released','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.purchase_receipt_status AS ENUM ('draft','received','partially_received','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.warehouse_status AS ENUM ('active','inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================================
-- warehouses
-- =========================================================================
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  status public.warehouse_status NOT NULL DEFAULT 'active',
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT warehouses_code_chk    CHECK (length(trim(code)) > 0),
  CONSTRAINT warehouses_name_chk    CHECK (length(trim(name)) > 0)
);
CREATE UNIQUE INDEX warehouses_one_default_idx
  ON public.warehouses ((true)) WHERE is_default = true AND deleted_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.warehouses TO authenticated;
GRANT ALL ON public.warehouses TO service_role;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "warehouses_staff_read"   ON public.warehouses FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "warehouses_staff_write"  ON public.warehouses FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "warehouses_staff_update" ON public.warehouses FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "warehouses_super_delete" ON public.warehouses FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_warehouses_updated_at
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed one default warehouse for V1
INSERT INTO public.warehouses (code, name, is_default, notes)
VALUES ('MAIN','Main Warehouse', true, 'Default warehouse created by Migration 05');

-- =========================================================================
-- inventory  (current snapshot per variant/warehouse)
-- =========================================================================
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  on_hand_qty NUMERIC(14,3) NOT NULL DEFAULT 0,
  reserved_qty NUMERIC(14,3) NOT NULL DEFAULT 0,
  available_qty NUMERIC(14,3)
    GENERATED ALWAYS AS (GREATEST(on_hand_qty - reserved_qty, 0)) STORED,
  reorder_point NUMERIC(14,3) NOT NULL DEFAULT 0,
  low_stock_threshold NUMERIC(14,3) NOT NULL DEFAULT 0,
  avg_cost NUMERIC(14,4) NOT NULL DEFAULT 0,
  last_movement_at TIMESTAMPTZ,
  last_counted_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT inventory_variant_warehouse_uniq UNIQUE (variant_id, warehouse_id),
  CONSTRAINT inventory_onhand_nonneg   CHECK (on_hand_qty  >= 0),
  CONSTRAINT inventory_reserved_nonneg CHECK (reserved_qty >= 0),
  CONSTRAINT inventory_reserved_le_onhand CHECK (reserved_qty <= on_hand_qty),
  CONSTRAINT inventory_reorder_nonneg  CHECK (reorder_point  >= 0),
  CONSTRAINT inventory_lowstock_nonneg CHECK (low_stock_threshold >= 0),
  CONSTRAINT inventory_avgcost_nonneg  CHECK (avg_cost >= 0)
);
CREATE INDEX inventory_variant_idx    ON public.inventory (variant_id);
CREATE INDEX inventory_warehouse_idx  ON public.inventory (warehouse_id);
CREATE INDEX inventory_lowstock_idx   ON public.inventory (warehouse_id)
  WHERE available_qty <= low_stock_threshold;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_staff_read"   ON public.inventory FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "inventory_staff_write"  ON public.inventory FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "inventory_staff_update" ON public.inventory FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "inventory_super_delete" ON public.inventory FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- stock_batches  (batch / lot / stock age)
-- =========================================================================
CREATE TABLE public.stock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT NOT NULL,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  received_qty NUMERIC(14,3) NOT NULL,
  remaining_qty NUMERIC(14,3) NOT NULL,
  purchase_cost NUMERIC(14,4) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  manufacture_date DATE,
  expiry_at DATE,
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT stock_batches_code_variant_uniq UNIQUE (variant_id, batch_code),
  CONSTRAINT stock_batches_code_chk       CHECK (length(trim(batch_code)) > 0),
  CONSTRAINT stock_batches_received_pos   CHECK (received_qty > 0),
  CONSTRAINT stock_batches_remaining_ok   CHECK (remaining_qty >= 0 AND remaining_qty <= received_qty),
  CONSTRAINT stock_batches_cost_nonneg    CHECK (purchase_cost >= 0),
  CONSTRAINT stock_batches_expiry_order   CHECK (expiry_at IS NULL OR manufacture_date IS NULL OR expiry_at >= manufacture_date)
);
CREATE INDEX stock_batches_variant_idx   ON public.stock_batches (variant_id);
CREATE INDEX stock_batches_supplier_idx  ON public.stock_batches (supplier_id);
CREATE INDEX stock_batches_received_idx  ON public.stock_batches (received_at);
CREATE INDEX stock_batches_expiry_idx    ON public.stock_batches (expiry_at) WHERE expiry_at IS NOT NULL;
CREATE INDEX stock_batches_active_idx    ON public.stock_batches (variant_id, received_at) WHERE remaining_qty > 0;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_batches TO authenticated;
GRANT ALL ON public.stock_batches TO service_role;
ALTER TABLE public.stock_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_batches_staff_read"   ON public.stock_batches FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "stock_batches_staff_write"  ON public.stock_batches FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "stock_batches_staff_update" ON public.stock_batches FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "stock_batches_super_delete" ON public.stock_batches FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_stock_batches_updated_at
  BEFORE UPDATE ON public.stock_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- inventory_ledger  (append-only immutable history)
-- =========================================================================
CREATE TABLE public.inventory_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES public.stock_batches(id) ON DELETE SET NULL,
  movement_type public.movement_type NOT NULL,
  qty_delta NUMERIC(14,3) NOT NULL,
  balance_after NUMERIC(14,3) NOT NULL,
  unit_cost NUMERIC(14,4),
  reference_type TEXT,    -- 'purchase_receipt','order','reservation','adjustment', etc.
  reference_id UUID,
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT inventory_ledger_delta_nonzero CHECK (qty_delta <> 0),
  CONSTRAINT inventory_ledger_balance_nonneg CHECK (balance_after >= 0),
  CONSTRAINT inventory_ledger_cost_nonneg   CHECK (unit_cost IS NULL OR unit_cost >= 0)
);
CREATE INDEX inventory_ledger_variant_idx    ON public.inventory_ledger (variant_id, occurred_at DESC);
CREATE INDEX inventory_ledger_warehouse_idx  ON public.inventory_ledger (warehouse_id, occurred_at DESC);
CREATE INDEX inventory_ledger_type_idx       ON public.inventory_ledger (movement_type);
CREATE INDEX inventory_ledger_reference_idx  ON public.inventory_ledger (reference_type, reference_id);
CREATE INDEX inventory_ledger_batch_idx      ON public.inventory_ledger (batch_id) WHERE batch_id IS NOT NULL;

GRANT SELECT, INSERT ON public.inventory_ledger TO authenticated;
GRANT ALL ON public.inventory_ledger TO service_role;
ALTER TABLE public.inventory_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_ledger_staff_read"   ON public.inventory_ledger FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "inventory_ledger_staff_write"  ON public.inventory_ledger FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
-- No UPDATE / DELETE policies for authenticated: ledger is immutable.

-- Belt-and-suspenders: block UPDATE/DELETE at the trigger level for anyone but super_admin
CREATE OR REPLACE FUNCTION public.inventory_ledger_immutable()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $fn$
BEGIN
  IF NOT public.has_role(auth.uid(),'super_admin') THEN
    RAISE EXCEPTION 'inventory_ledger is append-only. Post a compensating entry instead.'
      USING ERRCODE = '42501';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$fn$;
REVOKE ALL ON FUNCTION public.inventory_ledger_immutable() FROM PUBLIC;

CREATE TRIGGER trg_inventory_ledger_no_update
  BEFORE UPDATE ON public.inventory_ledger
  FOR EACH ROW EXECUTE FUNCTION public.inventory_ledger_immutable();
CREATE TRIGGER trg_inventory_ledger_no_delete
  BEFORE DELETE ON public.inventory_ledger
  FOR EACH ROW EXECUTE FUNCTION public.inventory_ledger_immutable();

-- =========================================================================
-- stock_reservations  (WhatsApp cart / order holds)
-- =========================================================================
CREATE TABLE public.stock_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  qty NUMERIC(14,3) NOT NULL,
  status public.reservation_status NOT NULL DEFAULT 'active',
  reference_type TEXT,  -- 'whatsapp_cart','order','manual', etc.
  reference_id UUID,
  expires_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT stock_reservations_qty_pos CHECK (qty > 0)
);
CREATE INDEX stock_reservations_variant_idx   ON public.stock_reservations (variant_id);
CREATE INDEX stock_reservations_warehouse_idx ON public.stock_reservations (warehouse_id);
CREATE INDEX stock_reservations_status_idx    ON public.stock_reservations (status);
CREATE INDEX stock_reservations_active_idx    ON public.stock_reservations (variant_id, warehouse_id) WHERE status = 'active';
CREATE INDEX stock_reservations_reference_idx ON public.stock_reservations (reference_type, reference_id);
CREATE INDEX stock_reservations_expires_idx   ON public.stock_reservations (expires_at) WHERE status = 'active';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_reservations TO authenticated;
GRANT ALL ON public.stock_reservations TO service_role;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_reservations_staff_read"   ON public.stock_reservations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "stock_reservations_staff_write"  ON public.stock_reservations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "stock_reservations_staff_update" ON public.stock_reservations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "stock_reservations_super_delete" ON public.stock_reservations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_stock_reservations_updated_at
  BEFORE UPDATE ON public.stock_reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- purchase_receipts  (goods received from suppliers)
-- =========================================================================
CREATE TABLE public.purchase_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
  status public.purchase_receipt_status NOT NULL DEFAULT 'draft',
  invoice_number TEXT,
  invoice_date DATE,
  received_at TIMESTAMPTZ,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT purchase_receipts_number_chk   CHECK (length(trim(receipt_number)) > 0),
  CONSTRAINT purchase_receipts_amounts_nonneg CHECK (
    subtotal >= 0 AND tax_amount >= 0 AND shipping_amount >= 0
    AND discount_amount >= 0 AND total_cost >= 0
  )
);
CREATE INDEX purchase_receipts_supplier_idx  ON public.purchase_receipts (supplier_id);
CREATE INDEX purchase_receipts_warehouse_idx ON public.purchase_receipts (warehouse_id);
CREATE INDEX purchase_receipts_status_idx    ON public.purchase_receipts (status);
CREATE INDEX purchase_receipts_received_idx  ON public.purchase_receipts (received_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_receipts TO authenticated;
GRANT ALL ON public.purchase_receipts TO service_role;
ALTER TABLE public.purchase_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchase_receipts_staff_read"   ON public.purchase_receipts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipts_staff_write"  ON public.purchase_receipts FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipts_staff_update" ON public.purchase_receipts FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipts_super_delete" ON public.purchase_receipts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_purchase_receipts_updated_at
  BEFORE UPDATE ON public.purchase_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- purchase_receipt_items  (line items)
-- =========================================================================
CREATE TABLE public.purchase_receipt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES public.purchase_receipts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES public.stock_batches(id) ON DELETE SET NULL,
  qty_ordered NUMERIC(14,3),
  qty_received NUMERIC(14,3) NOT NULL,
  unit_cost NUMERIC(14,4) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  notes TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT purchase_receipt_items_qty_pos    CHECK (qty_received > 0),
  CONSTRAINT purchase_receipt_items_ordered_ok CHECK (qty_ordered IS NULL OR qty_ordered > 0),
  CONSTRAINT purchase_receipt_items_costs_nonneg CHECK (
    unit_cost >= 0 AND tax_amount >= 0 AND discount_amount >= 0 AND line_total >= 0
  )
);
CREATE INDEX purchase_receipt_items_receipt_idx ON public.purchase_receipt_items (receipt_id);
CREATE INDEX purchase_receipt_items_variant_idx ON public.purchase_receipt_items (variant_id);
CREATE INDEX purchase_receipt_items_batch_idx   ON public.purchase_receipt_items (batch_id) WHERE batch_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_receipt_items TO authenticated;
GRANT ALL ON public.purchase_receipt_items TO service_role;
ALTER TABLE public.purchase_receipt_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchase_receipt_items_staff_read"   ON public.purchase_receipt_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipt_items_staff_write"  ON public.purchase_receipt_items FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipt_items_staff_update" ON public.purchase_receipt_items FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "purchase_receipt_items_super_delete" ON public.purchase_receipt_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_purchase_receipt_items_updated_at
  BEFORE UPDATE ON public.purchase_receipt_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- Convenience view: low stock readiness
-- =========================================================================
CREATE OR REPLACE VIEW public.v_low_stock AS
SELECT
  i.id            AS inventory_id,
  i.variant_id,
  i.warehouse_id,
  pv.sku,
  pv.name         AS variant_name,
  p.id            AS product_id,
  p.name          AS product_name,
  i.on_hand_qty,
  i.reserved_qty,
  i.available_qty,
  i.reorder_point,
  i.low_stock_threshold,
  CASE
    WHEN i.available_qty <= 0 THEN 'out_of_stock'
    WHEN i.available_qty <= i.low_stock_threshold THEN 'low'
    WHEN i.available_qty <= i.reorder_point THEN 'reorder'
    ELSE 'healthy'
  END AS stock_state,
  i.last_movement_at
FROM public.inventory i
JOIN public.product_variants pv ON pv.id = i.variant_id
JOIN public.products p ON p.id = pv.product_id;

GRANT SELECT ON public.v_low_stock TO authenticated;
GRANT SELECT ON public.v_low_stock TO service_role;
