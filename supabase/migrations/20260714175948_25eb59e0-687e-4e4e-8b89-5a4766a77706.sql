
-- =========================================================================
-- Migration 08 — Product Media + SEO Foundation
-- =========================================================================

-- Enums --------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.image_format AS ENUM ('jpg','jpeg','png','webp','avif','gif','svg','heic');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.image_role AS ENUM ('gallery','primary','hover','swatch','lifestyle','detail','size_chart','video_poster');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.image_processing_status AS ENUM ('pending','processing','ready','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.search_term_type AS ENUM ('keyword','synonym','tag','misspelling','brand_alias');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================================
-- 1. product_images
-- =========================================================================
CREATE TABLE public.product_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id      UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,

  -- Storage
  storage_path    TEXT NOT NULL,           -- bucket path (e.g. products/abc/hero.webp)
  url             TEXT,                    -- CDN / public URL (nullable until published)
  format          public.image_format NOT NULL DEFAULT 'jpg',
  mime_type       TEXT,
  file_size_bytes BIGINT,
  width_px        INTEGER,
  height_px       INTEGER,
  checksum_sha256 TEXT,

  -- Display
  role            public.image_role NOT NULL DEFAULT 'gallery',
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  is_hover        BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER NOT NULL DEFAULT 0,
  alt_text        TEXT NOT NULL,
  caption         TEXT,
  focal_x         NUMERIC(4,3),            -- 0.000 - 1.000
  focal_y         NUMERIC(4,3),

  -- AI / preview
  dominant_color  TEXT,                    -- #rrggbb
  blurhash        TEXT,
  ai_tags         TEXT[] NOT NULL DEFAULT '{}',
  processing_status public.image_processing_status NOT NULL DEFAULT 'ready',

  -- Free-form metadata (EXIF, moderation, variants map, srcset, etc.)
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Audit + soft delete
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at      TIMESTAMPTZ,
  deleted_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT product_images_alt_not_empty CHECK (length(btrim(alt_text)) > 0),
  CONSTRAINT product_images_dims_positive CHECK (
    (width_px  IS NULL OR width_px  > 0) AND
    (height_px IS NULL OR height_px > 0)
  ),
  CONSTRAINT product_images_size_positive CHECK (file_size_bytes IS NULL OR file_size_bytes > 0),
  CONSTRAINT product_images_focal_range CHECK (
    (focal_x IS NULL OR (focal_x >= 0 AND focal_x <= 1)) AND
    (focal_y IS NULL OR (focal_y >= 0 AND focal_y <= 1))
  ),
  CONSTRAINT product_images_display_order_nonneg CHECK (display_order >= 0)
);

GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_images_public_read"
  ON public.product_images FOR SELECT
  USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY "product_images_staff_read_all"
  ON public.product_images FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "product_images_staff_insert"
  ON public.product_images FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_images_staff_update"
  ON public.product_images FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_images_superadmin_delete"
  ON public.product_images FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

-- Indexes
CREATE INDEX idx_product_images_product        ON public.product_images(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_images_variant        ON public.product_images(variant_id) WHERE deleted_at IS NULL AND variant_id IS NOT NULL;
CREATE INDEX idx_product_images_order          ON public.product_images(product_id, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_images_role           ON public.product_images(product_id, role) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_images_processing     ON public.product_images(processing_status) WHERE processing_status <> 'ready';
CREATE INDEX idx_product_images_metadata_gin   ON public.product_images USING gin (metadata jsonb_path_ops);

-- Only one primary + one hover per product
CREATE UNIQUE INDEX uniq_product_images_primary
  ON public.product_images(product_id)
  WHERE is_primary = true AND deleted_at IS NULL;

CREATE UNIQUE INDEX uniq_product_images_hover
  ON public.product_images(product_id)
  WHERE is_hover = true AND deleted_at IS NULL;

CREATE TRIGGER trg_product_images_updated
  BEFORE UPDATE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 2. product_seo (1:1 with product)
-- =========================================================================
CREATE TABLE public.product_seo (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,

  seo_title           TEXT,
  meta_description    TEXT,
  canonical_url       TEXT,
  robots              TEXT NOT NULL DEFAULT 'index,follow',
  focus_keyword       TEXT,

  -- Open Graph
  og_title            TEXT,
  og_description      TEXT,
  og_image_url        TEXT,
  og_type             TEXT NOT NULL DEFAULT 'product',

  -- Twitter
  twitter_card        TEXT NOT NULL DEFAULT 'summary_large_image',
  twitter_title       TEXT,
  twitter_description TEXT,
  twitter_image_url   TEXT,

  -- Structured data (JSON-LD payload, hreflang, extras)
  structured_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
  hreflang            JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at          TIMESTAMPTZ,
  deleted_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT product_seo_title_len CHECK (seo_title IS NULL OR length(seo_title) <= 200),
  CONSTRAINT product_seo_meta_len  CHECK (meta_description IS NULL OR length(meta_description) <= 400),
  CONSTRAINT product_seo_twitter_card_valid CHECK (twitter_card IN ('summary','summary_large_image','app','player'))
);

GRANT SELECT ON public.product_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_seo TO authenticated;
GRANT ALL ON public.product_seo TO service_role;

ALTER TABLE public.product_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_seo_public_read"
  ON public.product_seo FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "product_seo_staff_insert"
  ON public.product_seo FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_seo_staff_update"
  ON public.product_seo FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_seo_superadmin_delete"
  ON public.product_seo FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_product_seo_product         ON public.product_seo(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_seo_structured_gin  ON public.product_seo USING gin (structured_data jsonb_path_ops);

CREATE TRIGGER trg_product_seo_updated
  BEFORE UPDATE ON public.product_seo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 3. product_search_terms
-- =========================================================================
CREATE TABLE public.product_search_terms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  term         TEXT NOT NULL,
  term_type    public.search_term_type NOT NULL DEFAULT 'keyword',
  locale       TEXT NOT NULL DEFAULT 'en',
  weight       NUMERIC(5,2) NOT NULL DEFAULT 1.00,   -- search boost
  source       TEXT NOT NULL DEFAULT 'manual',      -- manual | ai | import
  is_active    BOOLEAN NOT NULL DEFAULT true,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at   TIMESTAMPTZ,
  deleted_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT product_search_terms_term_not_empty CHECK (length(btrim(term)) > 0),
  CONSTRAINT product_search_terms_weight_range   CHECK (weight >= 0 AND weight <= 100)
);

GRANT SELECT ON public.product_search_terms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_search_terms TO authenticated;
GRANT ALL ON public.product_search_terms TO service_role;

ALTER TABLE public.product_search_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_search_terms_public_read"
  ON public.product_search_terms FOR SELECT
  USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY "product_search_terms_staff_read_all"
  ON public.product_search_terms FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "product_search_terms_staff_insert"
  ON public.product_search_terms FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_search_terms_staff_update"
  ON public.product_search_terms FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "product_search_terms_superadmin_delete"
  ON public.product_search_terms FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE UNIQUE INDEX uniq_product_search_terms
  ON public.product_search_terms(product_id, lower(term), term_type, locale)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_product_search_terms_product ON public.product_search_terms(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_search_terms_term    ON public.product_search_terms(lower(term)) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_product_search_terms_type    ON public.product_search_terms(term_type, locale) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_product_search_terms_updated
  BEFORE UPDATE ON public.product_search_terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
