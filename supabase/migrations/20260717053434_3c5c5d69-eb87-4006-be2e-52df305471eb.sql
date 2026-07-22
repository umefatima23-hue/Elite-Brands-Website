
-- =========================================================
-- MIGRATION 12 — Final Production Refinements
-- =========================================================

-- ---------- schema_versions ----------
CREATE TABLE IF NOT EXISTS public.schema_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version        TEXT NOT NULL UNIQUE,
  migration_name TEXT NOT NULL,
  checksum       TEXT,
  notes          TEXT,
  applied_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT schema_versions_version_nonempty CHECK (length(trim(version)) > 0),
  CONSTRAINT schema_versions_name_nonempty    CHECK (length(trim(migration_name)) > 0)
);

GRANT SELECT ON public.schema_versions TO authenticated;
GRANT ALL    ON public.schema_versions TO service_role;

ALTER TABLE public.schema_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schema_versions_staff_read"
  ON public.schema_versions FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "schema_versions_super_admin_write"
  ON public.schema_versions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX IF NOT EXISTS idx_schema_versions_applied_at
  ON public.schema_versions (applied_at DESC);

-- ---------- seed_history ----------
CREATE TABLE IF NOT EXISTS public.seed_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_key      TEXT NOT NULL UNIQUE,
  seed_name     TEXT NOT NULL,
  dataset_type  TEXT,
  rows_affected INTEGER DEFAULT 0 CHECK (rows_affected >= 0),
  checksum      TEXT,
  notes         TEXT,
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT seed_history_key_nonempty  CHECK (length(trim(seed_key)) > 0),
  CONSTRAINT seed_history_name_nonempty CHECK (length(trim(seed_name)) > 0)
);

GRANT SELECT ON public.seed_history TO authenticated;
GRANT ALL    ON public.seed_history TO service_role;

ALTER TABLE public.seed_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_history_staff_read"
  ON public.seed_history FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "seed_history_super_admin_write"
  ON public.seed_history FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX IF NOT EXISTS idx_seed_history_applied_at
  ON public.seed_history (applied_at DESC);

-- ---------- Backfill historical migrations ----------
INSERT INTO public.schema_versions (version, migration_name, notes) VALUES
  ('01', 'baseline_profiles_roles',        'Profiles, user_roles, has_role/is_staff'),
  ('02', 'reference_data',                 'Brands, categories, collections, seasons'),
  ('03', 'catalogue_foundation',           'Slugs, taxonomy hardening'),
  ('04', 'suppliers_products_core',        'Suppliers, products, variants, SKU registry'),
  ('05', 'inventory_intelligence',         'Warehouses, inventory, ledger, batches, reservations, receipts'),
  ('06', 'customers_orders_foundation',    'Customers, addresses, orders, items, events'),
  ('07', 'homepage_cms',                   'Hero, banners, announcements, footer, sections, settings'),
  ('08', 'product_media_seo',              'Product images, SEO, search terms'),
  ('09', 'airtable_integration',           'Connections, external IDs, sync log, cursors, conflicts'),
  ('10', 'whatsapp_commerce',              'Templates, campaigns, conversations, messages'),
  ('11', 'production_operations',          'Audit, errors, notifications, jobs, feature flags, rate limits'),
  ('12', 'final_production_refinements',   'schema_versions, seed_history, defensive indexes')
ON CONFLICT (version) DO NOTHING;

-- ---------- Defensive performance indexes ----------
-- Orders: common admin & customer history queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_created
  ON public.orders (customer_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON public.orders (status, created_at DESC)
  WHERE deleted_at IS NULL;

-- Order items lookup by product / variant
CREATE INDEX IF NOT EXISTS idx_order_items_variant
  ON public.order_items (variant_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product
  ON public.order_items (product_id);

-- Inventory ledger history by variant
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_variant_created
  ON public.inventory_ledger (variant_id, created_at DESC);

-- WhatsApp messages: conversation timeline
CREATE INDEX IF NOT EXISTS idx_wa_messages_conversation_created
  ON public.whatsapp_messages (conversation_id, created_at DESC);

-- Products: active catalogue browsing
CREATE INDEX IF NOT EXISTS idx_products_status_created
  ON public.products (status, created_at DESC)
  WHERE deleted_at IS NULL;
