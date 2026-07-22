-- ============================================================================
-- MIGRATION 04 — SUPPLIERS & PRODUCTS CORE
-- Elite Brands v1.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SKU REGISTRY — permanent, append-only ledger of every SKU ever assigned.
-- Guarantees a SKU cannot be reused, even after the owning row is archived
-- or hard-deleted. products.sku and product_variants.sku are FKs to this table.
-- ----------------------------------------------------------------------------
CREATE TABLE public.sku_registry (
  sku          TEXT PRIMARY KEY,
  entity_type  TEXT NOT NULL CHECK (entity_type IN ('product','variant')),
  entity_id    UUID,
  reserved_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reserved_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes        TEXT,
  CONSTRAINT sku_registry_format CHECK (
    length(sku) BETWEEN 3 AND 64
    AND sku = upper(sku)
    AND sku ~ '^[A-Z0-9][A-Z0-9\-]*[A-Z0-9]$'
  )
);

GRANT SELECT ON public.sku_registry TO authenticated;
GRANT ALL    ON public.sku_registry TO service_role;

ALTER TABLE public.sku_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY sku_registry_select_staff ON public.sku_registry
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

-- Only super_admin may hand-write; normal writes flow through the
-- SECURITY DEFINER reserve_sku() helper triggered by products/variants.
CREATE POLICY sku_registry_insert_super_admin ON public.sku_registry
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY sku_registry_update_super_admin ON public.sku_registry
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- Intentional: NO delete policy. The registry is append-only.

COMMENT ON TABLE public.sku_registry IS
$doc$Permanent, append-only ledger of every SKU ever assigned to a product or variant.
Rows are never removed. Even if a product or variant is archived, discontinued,
or hard-deleted, its SKU stays here so it cannot be reassigned to another
entity. products.sku and product_variants.sku are foreign keys to this table.$doc$;

-- ----------------------------------------------------------------------------
-- SUPPLIERS
-- ----------------------------------------------------------------------------
CREATE TABLE public.suppliers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  company_name    TEXT,
  contact_person  TEXT,
  whatsapp_number TEXT,
  phone           TEXT,
  email           TEXT,
  address_line1   TEXT,
  address_line2   TEXT,
  city            TEXT,
  state           TEXT,
  postal_code     TEXT,
  country         TEXT DEFAULT 'PK',
  website_url     TEXT,
  notes           TEXT,
  status          public.supplier_status NOT NULL DEFAULT 'active',
  meta            JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at      TIMESTAMPTZ,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT suppliers_name_not_empty   CHECK (length(trim(name)) > 0),
  CONSTRAINT suppliers_slug_format      CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT suppliers_email_format     CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT suppliers_website_url_format CHECK (website_url IS NULL OR website_url ~* '^https?://')
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
-- No anon grant: suppliers are internal-only.

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY suppliers_select_staff ON public.suppliers
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY suppliers_insert_staff ON public.suppliers
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY suppliers_update_staff ON public.suppliers
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY suppliers_delete_super_admin ON public.suppliers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX suppliers_slug_idx      ON public.suppliers (slug)   WHERE deleted_at IS NULL;
CREATE INDEX suppliers_status_idx    ON public.suppliers (status) WHERE deleted_at IS NULL;
CREATE INDEX suppliers_name_trgm_idx ON public.suppliers USING gin (name extensions.gin_trgm_ops);
CREATE INDEX suppliers_whatsapp_idx  ON public.suppliers (whatsapp_number) WHERE whatsapp_number IS NOT NULL AND deleted_at IS NULL;

CREATE TRIGGER suppliers_set_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
CREATE TABLE public.products (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  sku                   TEXT NOT NULL UNIQUE,
  barcode               TEXT UNIQUE,
  slug                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  short_description     TEXT,
  long_description      TEXT,

  -- Relationships
  brand_id              UUID REFERENCES public.brands(id)     ON DELETE RESTRICT,
  primary_category_id   UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  supplier_id           UUID REFERENCES public.suppliers(id)  ON DELETE RESTRICT,

  -- Status
  status                public.product_status NOT NULL DEFAULT 'draft',

  -- Pricing (decimal, currency-neutral; PKR by default)
  currency              CHAR(3)       NOT NULL DEFAULT 'PKR',
  original_price        NUMERIC(12,2) NOT NULL,
  sale_price            NUMERIC(12,2),
  discount_amount       NUMERIC(12,2) GENERATED ALWAYS AS (
    CASE WHEN sale_price IS NULL THEN 0 ELSE original_price - sale_price END
  ) STORED,
  discount_percentage   NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN sale_price IS NULL OR original_price = 0 THEN 0
      ELSE round(((original_price - sale_price) / original_price * 100)::numeric, 2)
    END
  ) STORED,

  -- Flags
  is_premium_outlet     BOOLEAN NOT NULL DEFAULT false,
  is_featured           BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival        BOOLEAN NOT NULL DEFAULT false,
  is_best_seller        BOOLEAN NOT NULL DEFAULT false,
  is_trending           BOOLEAN NOT NULL DEFAULT false,
  is_limited_stock      BOOLEAN NOT NULL DEFAULT false,
  is_editors_choice     BOOLEAN NOT NULL DEFAULT false,

  -- SEO
  seo_title             TEXT,
  meta_description      TEXT,
  canonical_url         TEXT,
  og_image_url          TEXT,

  -- Search
  search_keywords       TEXT[] NOT NULL DEFAULT '{}',
  tags                  TEXT[] NOT NULL DEFAULT '{}',

  -- Structured attributes (fabric, pieces, sleeves, colour_family, occasion, style, etc.)
  attributes            JSONB  NOT NULL DEFAULT '{}'::jsonb,

  -- Ordering / integration scratchpad
  sort_order            INTEGER NOT NULL DEFAULT 0,
  meta                  JSONB   NOT NULL DEFAULT '{}'::jsonb,

  -- Audit + soft delete
  deleted_at            TIMESTAMPTZ,
  published_at          TIMESTAMPTZ,
  created_by            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT products_name_not_empty       CHECK (length(trim(name)) > 0),
  CONSTRAINT products_slug_format          CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT products_currency_format      CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT products_original_price_pos   CHECK (original_price > 0),
  CONSTRAINT products_sale_price_pos       CHECK (sale_price IS NULL OR sale_price > 0),
  CONSTRAINT products_sale_le_original     CHECK (sale_price IS NULL OR sale_price <= original_price),
  CONSTRAINT products_canonical_url_format CHECK (canonical_url IS NULL OR canonical_url ~* '^https?://'),
  CONSTRAINT products_og_image_url_format  CHECK (og_image_url  IS NULL OR og_image_url  ~* '^https?://'),
  CONSTRAINT products_barcode_format       CHECK (barcode IS NULL OR barcode ~ '^[A-Z0-9\-]{4,64}$'),
  CONSTRAINT products_sku_format CHECK (
    length(sku) BETWEEN 3 AND 64
    AND sku = upper(sku)
    AND sku ~ '^[A-Z0-9][A-Z0-9\-]*[A-Z0-9]$'
  ),
  CONSTRAINT products_sku_registry_fk FOREIGN KEY (sku)
    REFERENCES public.sku_registry(sku) ON UPDATE RESTRICT ON DELETE RESTRICT
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_select_public ON public.products
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL AND status IN ('active','coming_soon','out_of_stock'));

CREATE POLICY products_select_staff ON public.products
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY products_insert_staff ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY products_update_staff ON public.products
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY products_delete_super_admin ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX products_sku_idx            ON public.products (sku);
CREATE INDEX products_barcode_idx        ON public.products (barcode) WHERE barcode IS NOT NULL;
CREATE INDEX products_slug_idx           ON public.products (slug)               WHERE deleted_at IS NULL;
CREATE INDEX products_brand_idx          ON public.products (brand_id)           WHERE deleted_at IS NULL;
CREATE INDEX products_category_idx       ON public.products (primary_category_id) WHERE deleted_at IS NULL;
CREATE INDEX products_supplier_idx       ON public.products (supplier_id)        WHERE deleted_at IS NULL;
CREATE INDEX products_status_idx         ON public.products (status)             WHERE deleted_at IS NULL;
CREATE INDEX products_featured_idx       ON public.products (is_featured, sort_order)       WHERE deleted_at IS NULL AND is_featured       = true;
CREATE INDEX products_premium_idx        ON public.products (is_premium_outlet, sort_order) WHERE deleted_at IS NULL AND is_premium_outlet = true;
CREATE INDEX products_new_arrival_idx    ON public.products (is_new_arrival, published_at DESC) WHERE deleted_at IS NULL AND is_new_arrival = true;
CREATE INDEX products_best_seller_idx    ON public.products (is_best_seller, sort_order)    WHERE deleted_at IS NULL AND is_best_seller    = true;
CREATE INDEX products_trending_idx       ON public.products (is_trending, sort_order)       WHERE deleted_at IS NULL AND is_trending       = true;
CREATE INDEX products_published_idx      ON public.products (published_at DESC) WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX products_sale_idx           ON public.products (sale_price)        WHERE deleted_at IS NULL AND sale_price IS NOT NULL;
CREATE INDEX products_name_trgm_idx      ON public.products USING gin (name extensions.gin_trgm_ops);
CREATE INDEX products_tags_gin_idx       ON public.products USING gin (tags);
CREATE INDEX products_keywords_gin_idx   ON public.products USING gin (search_keywords);
CREATE INDEX products_attributes_gin_idx ON public.products USING gin (attributes jsonb_path_ops);

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- PRODUCT VARIANTS
-- ----------------------------------------------------------------------------
CREATE TABLE public.product_variants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku            TEXT NOT NULL UNIQUE,
  barcode        TEXT UNIQUE,
  name           TEXT NOT NULL,
  is_default     BOOLEAN NOT NULL DEFAULT false,
  sort_order     INTEGER NOT NULL DEFAULT 0,

  -- Optional per-variant pricing override; NULL = inherit from parent product.
  original_price NUMERIC(12,2),
  sale_price     NUMERIC(12,2),

  -- Variant-level attributes (size, colour code, etc.)
  attributes     JSONB NOT NULL DEFAULT '{}'::jsonb,

  status         public.product_status NOT NULL DEFAULT 'active',
  meta           JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at     TIMESTAMPTZ,
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT product_variants_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT product_variants_sku_format CHECK (
    length(sku) BETWEEN 3 AND 64
    AND sku = upper(sku)
    AND sku ~ '^[A-Z0-9][A-Z0-9\-]*[A-Z0-9]$'
  ),
  CONSTRAINT product_variants_barcode_format       CHECK (barcode IS NULL OR barcode ~ '^[A-Z0-9\-]{4,64}$'),
  CONSTRAINT product_variants_original_price_pos   CHECK (original_price IS NULL OR original_price > 0),
  CONSTRAINT product_variants_sale_price_pos       CHECK (sale_price     IS NULL OR sale_price     > 0),
  CONSTRAINT product_variants_sale_le_original     CHECK (
    sale_price IS NULL OR original_price IS NULL OR sale_price <= original_price
  ),
  CONSTRAINT product_variants_sku_registry_fk FOREIGN KEY (sku)
    REFERENCES public.sku_registry(sku) ON UPDATE RESTRICT ON DELETE RESTRICT
);

GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_variants_select_public ON public.product_variants
  FOR SELECT TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status IN ('active','coming_soon','out_of_stock')
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND p.deleted_at IS NULL
        AND p.status IN ('active','coming_soon','out_of_stock')
    )
  );
CREATE POLICY product_variants_select_staff ON public.product_variants
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY product_variants_insert_staff ON public.product_variants
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY product_variants_update_staff ON public.product_variants
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY product_variants_delete_super_admin ON public.product_variants
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX product_variants_product_idx      ON public.product_variants (product_id) WHERE deleted_at IS NULL;
CREATE INDEX product_variants_sku_idx          ON public.product_variants (sku);
CREATE INDEX product_variants_barcode_idx      ON public.product_variants (barcode) WHERE barcode IS NOT NULL;
CREATE INDEX product_variants_status_idx       ON public.product_variants (status)  WHERE deleted_at IS NULL;
CREATE INDEX product_variants_attributes_gin_idx ON public.product_variants USING gin (attributes jsonb_path_ops);

-- Exactly one default variant per product (live rows only).
CREATE UNIQUE INDEX product_variants_one_default_per_product
  ON public.product_variants (product_id)
  WHERE deleted_at IS NULL AND is_default = true;

CREATE TRIGGER product_variants_set_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- SKU RESERVATION + IMMUTABILITY
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_sku(_sku TEXT, _entity_type TEXT, _entity_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.sku_registry (sku, entity_type, entity_id, reserved_by)
  VALUES (_sku, _entity_type, _entity_id, auth.uid());
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'SKU % has already been used and cannot be reassigned. SKUs are reserved permanently in sku_registry.', _sku
    USING ERRCODE = '23505';
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_sku(TEXT, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reserve_sku(TEXT, TEXT, UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.products_reserve_sku_trg()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM public.reserve_sku(NEW.sku, 'product', NEW.id);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.product_variants_reserve_sku_trg()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM public.reserve_sku(NEW.sku, 'variant', NEW.id);
  RETURN NEW;
END; $$;

CREATE TRIGGER products_reserve_sku
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.products_reserve_sku_trg();

CREATE TRIGGER product_variants_reserve_sku
  BEFORE INSERT ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.product_variants_reserve_sku_trg();

-- SKU is immutable except by super_admin. When super_admin changes it, the
-- new SKU is also reserved permanently; the old one stays reserved too.
CREATE OR REPLACE FUNCTION public.enforce_sku_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.sku IS DISTINCT FROM OLD.sku THEN
    IF NOT public.has_role(auth.uid(),'super_admin') THEN
      RAISE EXCEPTION 'SKU is immutable. Only super_admin may change a SKU (was: %, attempted: %).',
        OLD.sku, NEW.sku USING ERRCODE = '42501';
    END IF;
    PERFORM public.reserve_sku(NEW.sku, TG_ARGV[0], NEW.id);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER products_enforce_sku_immutable
  BEFORE UPDATE OF sku ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sku_immutable('product');

CREATE TRIGGER product_variants_enforce_sku_immutable
  BEFORE UPDATE OF sku ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sku_immutable('variant');

-- Hard delete: leave the registry row, null the entity_id so it's clearly
-- orphaned. The SKU remains permanently blocked from reuse.
CREATE OR REPLACE FUNCTION public.orphan_sku_on_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.sku_registry SET entity_id = NULL WHERE sku = OLD.sku;
  RETURN OLD;
END; $$;

CREATE TRIGGER products_orphan_sku
  AFTER DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.orphan_sku_on_delete();

CREATE TRIGGER product_variants_orphan_sku
  AFTER DELETE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.orphan_sku_on_delete();

-- ----------------------------------------------------------------------------
-- JOIN: product_categories (M:N)
-- ----------------------------------------------------------------------------
CREATE TABLE public.product_categories (
  product_id  UUID NOT NULL REFERENCES public.products(id)   ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);
GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_categories_select_public ON public.product_categories
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_categories.product_id
      AND p.deleted_at IS NULL
      AND p.status IN ('active','coming_soon','out_of_stock')
  ));
CREATE POLICY product_categories_select_staff ON public.product_categories
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY product_categories_insert_staff ON public.product_categories
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY product_categories_delete_staff ON public.product_categories
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE INDEX product_categories_category_idx ON public.product_categories (category_id);

-- ----------------------------------------------------------------------------
-- JOIN: product_collections (M:N)
-- ----------------------------------------------------------------------------
CREATE TABLE public.product_collections (
  product_id    UUID NOT NULL REFERENCES public.products(id)    ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE RESTRICT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, collection_id)
);
GRANT SELECT ON public.product_collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_collections TO authenticated;
GRANT ALL ON public.product_collections TO service_role;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_collections_select_public ON public.product_collections
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_collections.product_id
      AND p.deleted_at IS NULL
      AND p.status IN ('active','coming_soon','out_of_stock')
  ));
CREATE POLICY product_collections_select_staff ON public.product_collections
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY product_collections_insert_staff ON public.product_collections
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY product_collections_update_staff ON public.product_collections
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY product_collections_delete_staff ON public.product_collections
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE INDEX product_collections_collection_idx ON public.product_collections (collection_id, sort_order);

-- ----------------------------------------------------------------------------
-- DOCUMENTATION
-- ----------------------------------------------------------------------------
COMMENT ON TABLE public.suppliers IS 'Vendors/distributors who supply products. Internal-only entity; no anon access.';
COMMENT ON TABLE public.products IS
$doc$Single source of truth for the product catalogue.
Every product has a globally unique SKU registered in sku_registry. SKUs are
immutable except by super_admin and can never be reassigned once used.$doc$;
COMMENT ON TABLE public.product_variants IS
$doc$Per-product variants (size, colourway, capsule edition). V1 typically uses
one default variant per product; the schema supports N without redesign. Each
variant has its own globally unique SKU governed by the same registry rules.$doc$;
COMMENT ON TABLE public.product_categories  IS 'M:N join between products and categories.';
COMMENT ON TABLE public.product_collections IS 'M:N join between products and collections.';

COMMENT ON COLUMN public.products.sku IS
  'Globally unique, immutable business identifier. Registered in sku_registry — never reused, even after archive/delete. Only super_admin may change after creation.';
COMMENT ON COLUMN public.products.attributes IS
  'Structured product attributes (fabric, pieces, sleeves, colour_family, occasion, style, etc.). JSONB with jsonb_path_ops GIN index. Never embed structured data in long_description.';
COMMENT ON COLUMN public.products.meta IS
  'Reserved JSONB scratchpad for integrations only (Airtable sync, WhatsApp Commerce, external IDs). Never store core business fields here.';
COMMENT ON COLUMN public.products.discount_amount IS
  'Generated: original_price - sale_price (0 when no sale_price).';
COMMENT ON COLUMN public.products.discount_percentage IS
  'Generated: percentage discount vs original_price, 2 decimal places.';
COMMENT ON COLUMN public.product_variants.sku IS
  'Globally unique, immutable variant identifier. Same registry and rules as products.sku.';
COMMENT ON COLUMN public.suppliers.meta IS
  'Reserved JSONB scratchpad for integrations only. Never store core business fields here.';