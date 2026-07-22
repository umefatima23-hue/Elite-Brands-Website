
-- =========================================================================
-- MIGRATION 07 — HOMEPAGE CMS FOUNDATION
-- =========================================================================

-- Enums ------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.homepage_section_type AS ENUM (
    'featured_brands','featured_products','premium_outlet',
    'new_arrivals','best_sellers','custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.homepage_item_entity AS ENUM ('product','brand','collection','category');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.promo_banner_placement AS ENUM (
    'homepage_top','homepage_mid','homepage_bottom','sidebar','shop_top'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Shared helper: is_active_now (schedule window check) --------------------
CREATE OR REPLACE FUNCTION public.cms_in_window(_start TIMESTAMPTZ, _end TIMESTAMPTZ)
RETURNS BOOLEAN LANGUAGE SQL IMMUTABLE AS $$
  SELECT (_start IS NULL OR _start <= now())
     AND (_end   IS NULL OR _end   >= now())
$$;

-- =========================================================================
-- 1. hero_banners
-- =========================================================================
CREATE TABLE public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  subtitle TEXT,
  eyebrow TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  image_alt TEXT,
  cta_label TEXT,
  cta_href TEXT,
  secondary_cta_label TEXT,
  secondary_cta_href TEXT,
  layout_variant TEXT NOT NULL DEFAULT 'default',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);
GRANT SELECT ON public.hero_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_banners TO authenticated;
GRANT ALL ON public.hero_banners TO service_role;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_hero_banners_active_order ON public.hero_banners(is_active, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_hero_banners_schedule ON public.hero_banners(start_at, end_at) WHERE deleted_at IS NULL;

CREATE POLICY "hero_banners_public_read" ON public.hero_banners FOR SELECT
  USING (deleted_at IS NULL AND is_active AND public.cms_in_window(start_at, end_at));
CREATE POLICY "hero_banners_staff_read_all" ON public.hero_banners FOR SELECT
  TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hero_banners_staff_insert" ON public.hero_banners FOR INSERT
  TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hero_banners_staff_update" ON public.hero_banners FOR UPDATE
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hero_banners_superadmin_delete" ON public.hero_banners FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_hero_banners_updated_at BEFORE UPDATE ON public.hero_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 2. promotional_banners
-- =========================================================================
CREATE TABLE public.promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement public.promo_banner_placement NOT NULL DEFAULT 'homepage_mid',
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  subtitle TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  image_alt TEXT,
  link_href TEXT,
  cta_label TEXT,
  background_color TEXT,
  text_color TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);
GRANT SELECT ON public.promotional_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotional_banners TO authenticated;
GRANT ALL ON public.promotional_banners TO service_role;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_promo_banners_placement ON public.promotional_banners(placement, is_active, display_order) WHERE deleted_at IS NULL;

CREATE POLICY "promo_banners_public_read" ON public.promotional_banners FOR SELECT
  USING (deleted_at IS NULL AND is_active AND public.cms_in_window(start_at, end_at));
CREATE POLICY "promo_banners_staff_read_all" ON public.promotional_banners FOR SELECT
  TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "promo_banners_staff_insert" ON public.promotional_banners FOR INSERT
  TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "promo_banners_staff_update" ON public.promotional_banners FOR UPDATE
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "promo_banners_superadmin_delete" ON public.promotional_banners FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_promo_banners_updated_at BEFORE UPDATE ON public.promotional_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 3. announcements
-- =========================================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL CHECK (length(btrim(message)) > 0),
  link_href TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_announcements_active ON public.announcements(is_active, priority DESC) WHERE deleted_at IS NULL;

CREATE POLICY "announcements_public_read" ON public.announcements FOR SELECT
  USING (deleted_at IS NULL AND is_active AND public.cms_in_window(start_at, end_at));
CREATE POLICY "announcements_staff_read_all" ON public.announcements FOR SELECT
  TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "announcements_staff_insert" ON public.announcements FOR INSERT
  TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "announcements_staff_update" ON public.announcements FOR UPDATE
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "announcements_superadmin_delete" ON public.announcements FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 4. homepage_sections
-- =========================================================================
CREATE TABLE public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type public.homepage_section_type NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (length(btrim(slug)) > 0),
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  subtitle TEXT,
  eyebrow TEXT,
  cta_label TEXT,
  cta_href TEXT,
  layout_variant TEXT NOT NULL DEFAULT 'default',
  max_items INTEGER NOT NULL DEFAULT 8 CHECK (max_items > 0 AND max_items <= 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);
GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_homepage_sections_active_order ON public.homepage_sections(is_active, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_homepage_sections_type ON public.homepage_sections(section_type);

CREATE POLICY "homepage_sections_public_read" ON public.homepage_sections FOR SELECT
  USING (deleted_at IS NULL AND is_active AND public.cms_in_window(start_at, end_at));
CREATE POLICY "homepage_sections_staff_read_all" ON public.homepage_sections FOR SELECT
  TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "homepage_sections_staff_insert" ON public.homepage_sections FOR INSERT
  TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "homepage_sections_staff_update" ON public.homepage_sections FOR UPDATE
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "homepage_sections_superadmin_delete" ON public.homepage_sections FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 5. homepage_section_items
-- =========================================================================
CREATE TABLE public.homepage_section_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
  entity_type public.homepage_item_entity NOT NULL,
  entity_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE (section_id, entity_type, entity_id)
);
GRANT SELECT ON public.homepage_section_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_section_items TO authenticated;
GRANT ALL ON public.homepage_section_items TO service_role;
ALTER TABLE public.homepage_section_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_hs_items_section ON public.homepage_section_items(section_id, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_hs_items_entity ON public.homepage_section_items(entity_type, entity_id);

CREATE POLICY "hs_items_public_read" ON public.homepage_section_items FOR SELECT
  USING (deleted_at IS NULL AND is_active);
CREATE POLICY "hs_items_staff_read_all" ON public.homepage_section_items FOR SELECT
  TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "hs_items_staff_insert" ON public.homepage_section_items FOR INSERT
  TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hs_items_staff_update" ON public.homepage_section_items FOR UPDATE
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hs_items_superadmin_delete" ON public.homepage_section_items FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_hs_items_updated_at BEFORE UPDATE ON public.homepage_section_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 6. footer_columns + footer_links
-- =========================================================================
CREATE TABLE public.footer_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ
);
GRANT SELECT ON public.footer_columns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_columns TO authenticated;
GRANT ALL ON public.footer_columns TO service_role;
ALTER TABLE public.footer_columns ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_footer_columns_order ON public.footer_columns(is_active, display_order) WHERE deleted_at IS NULL;

CREATE POLICY "footer_columns_public_read" ON public.footer_columns FOR SELECT USING (deleted_at IS NULL AND is_active);
CREATE POLICY "footer_columns_staff_read_all" ON public.footer_columns FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "footer_columns_staff_insert" ON public.footer_columns FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "footer_columns_staff_update" ON public.footer_columns FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "footer_columns_superadmin_delete" ON public.footer_columns FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_footer_columns_updated_at BEFORE UPDATE ON public.footer_columns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES public.footer_columns(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (length(btrim(label)) > 0),
  href TEXT NOT NULL CHECK (length(btrim(href)) > 0),
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ
);
GRANT SELECT ON public.footer_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_links TO authenticated;
GRANT ALL ON public.footer_links TO service_role;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_footer_links_column ON public.footer_links(column_id, display_order) WHERE deleted_at IS NULL;

CREATE POLICY "footer_links_public_read" ON public.footer_links FOR SELECT USING (deleted_at IS NULL AND is_active);
CREATE POLICY "footer_links_staff_read_all" ON public.footer_links FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "footer_links_staff_insert" ON public.footer_links FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "footer_links_staff_update" ON public.footer_links FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "footer_links_superadmin_delete" ON public.footer_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_footer_links_updated_at BEFORE UPDATE ON public.footer_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 7. social_links
-- =========================================================================
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (length(btrim(platform)) > 0),
  handle TEXT,
  url TEXT NOT NULL CHECK (length(btrim(url)) > 0),
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE (platform)
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_social_links_order ON public.social_links(is_active, display_order) WHERE deleted_at IS NULL;

CREATE POLICY "social_links_public_read" ON public.social_links FOR SELECT USING (deleted_at IS NULL AND is_active);
CREATE POLICY "social_links_staff_read_all" ON public.social_links FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "social_links_staff_insert" ON public.social_links FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "social_links_staff_update" ON public.social_links FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "social_links_superadmin_delete" ON public.social_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_social_links_updated_at BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 8. site_settings  (singleton — contact info + default SEO)
-- =========================================================================
CREATE TABLE public.site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true), -- enforce singleton
  -- Contact
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_address TEXT,
  contact_city TEXT,
  contact_country TEXT,
  business_hours TEXT,
  -- Default SEO
  default_meta_title TEXT,
  default_meta_description TEXT,
  default_og_image_url TEXT,
  default_twitter_handle TEXT,
  seo_keywords TEXT[],
  robots_directives TEXT,
  -- Extensible
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_staff_insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "site_settings_staff_update" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "site_settings_superadmin_delete" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton row
INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;
