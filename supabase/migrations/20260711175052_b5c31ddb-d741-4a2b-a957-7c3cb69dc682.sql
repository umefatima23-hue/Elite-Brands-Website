-- ============================================================================
-- FOUNDATION RESTORE — Migrations 01, 02, 02-perms, 03, 03b (previously approved)
-- Applied here as a single migration to seed a fresh Cloud project with the
-- approved foundation. No changes vs the approved SQL.
-- ============================================================================


-- =============================================================
-- Migration 01: Extensions, Enums & Utility Functions
-- =============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE result TEXT;
BEGIN
  IF input_text IS NULL OR length(trim(input_text)) = 0 THEN RETURN NULL; END IF;
  result := lower(unaccent(input_text));
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '-+', '-', 'g');
  result := trim(both '-' from result);
  RETURN result;
END; $$;

CREATE TYPE public.product_status AS ENUM ('draft','active','coming_soon','out_of_stock','archived','discontinued');
CREATE TYPE public.order_status   AS ENUM ('pending','confirmed','packing','dispatched','delivered','cancelled','returned','refunded');
CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded','cod_pending');
CREATE TYPE public.payment_method AS ENUM ('cod','bank_transfer','card','whatsapp');
CREATE TYPE public.inventory_movement_type AS ENUM ('purchase','sale','return','adjustment','reservation','release','damage','transfer');
CREATE TYPE public.app_role       AS ENUM ('super_admin','admin','manager','staff','customer');
CREATE TYPE public.supplier_status AS ENUM ('active','inactive','pending','blacklisted');
CREATE TYPE public.sync_status    AS ENUM ('pending','syncing','synced','failed','conflict');

-- Move extensions to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
ALTER EXTENSION citext   SET SCHEMA extensions;
ALTER EXTENSION pg_trgm  SET SCHEMA extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT LANGUAGE plpgsql IMMUTABLE SET search_path = public, extensions AS $$
DECLARE result TEXT;
BEGIN
  IF input_text IS NULL OR length(trim(input_text)) = 0 THEN RETURN NULL; END IF;
  result := lower(extensions.unaccent(input_text));
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '-+', '-', 'g');
  result := trim(both '-' from result);
  RETURN result;
END; $$;

-- =============================================================
-- Migration 02: Identity & RBAC
-- =============================================================
CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT,
  phone               TEXT,
  whatsapp_number     TEXT,
  avatar_url          TEXT,
  preferred_language  TEXT NOT NULL DEFAULT 'en',
  marketing_opt_in    BOOLEAN NOT NULL DEFAULT false,
  last_seen_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_profiles_whatsapp_number ON public.profiles(whatsapp_number) WHERE whatsapp_number IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role    ON public.user_roles(role);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_user_roles_updated_at BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('super_admin','admin','manager','staff'));
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NULLIF(NEW.raw_user_meta_data->>'full_name',''), NULLIF(NEW.phone,''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_select_staff" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_delete_super_admin" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_select_staff" ON public.user_roles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "user_roles_insert_super_admin" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "user_roles_update_super_admin" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "user_roles_delete_super_admin" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_staff(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_slug(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.generate_slug(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- =============================================================
-- Migration 03: Catalogue Core (brands, categories, collections)
-- =============================================================
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  tagline TEXT, description TEXT, logo_url TEXT, hero_image_url TEXT,
  country_of_origin TEXT DEFAULT 'PK', website_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false, sort_order INTEGER NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'active', meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT brands_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT brands_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
GRANT SELECT ON public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY brands_select_public ON public.brands FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND status = 'active');
CREATE POLICY brands_select_staff ON public.brands FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY brands_insert_staff ON public.brands FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY brands_update_staff ON public.brands FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY brands_delete_super_admin ON public.brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));
CREATE INDEX brands_slug_idx ON public.brands (slug) WHERE deleted_at IS NULL;
CREATE INDEX brands_status_idx ON public.brands (status) WHERE deleted_at IS NULL;
CREATE INDEX brands_featured_idx ON public.brands (is_featured, sort_order) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX brands_sort_idx ON public.brands (sort_order) WHERE deleted_at IS NULL;
CREATE INDEX brands_name_trgm_idx ON public.brands USING gin (name extensions.gin_trgm_ops);
CREATE TRIGGER brands_set_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT, image_url TEXT, icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0, is_featured BOOLEAN NOT NULL DEFAULT false,
  status product_status NOT NULL DEFAULT 'active', meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT categories_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT categories_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id)
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_select_public ON public.categories FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND status = 'active');
CREATE POLICY categories_select_staff ON public.categories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY categories_insert_staff ON public.categories FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY categories_update_staff ON public.categories FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY categories_delete_super_admin ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));
CREATE INDEX categories_slug_idx ON public.categories (slug) WHERE deleted_at IS NULL;
CREATE INDEX categories_parent_idx ON public.categories (parent_id) WHERE deleted_at IS NULL;
CREATE INDEX categories_status_idx ON public.categories (status) WHERE deleted_at IS NULL;
CREATE INDEX categories_featured_idx ON public.categories (is_featured, sort_order) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX categories_sort_idx ON public.categories (parent_id, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX categories_name_trgm_idx ON public.categories USING gin (name extensions.gin_trgm_ops);
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT, cover_image_url TEXT, hero_image_url TEXT,
  season TEXT, year SMALLINT, launch_date DATE, end_date DATE,
  is_featured BOOLEAN NOT NULL DEFAULT false, sort_order INTEGER NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'active', meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT collections_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT collections_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT collections_year_range CHECK (year IS NULL OR (year BETWEEN 2000 AND 2100)),
  CONSTRAINT collections_date_range CHECK (end_date IS NULL OR launch_date IS NULL OR end_date >= launch_date)
);
GRANT SELECT ON public.collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY collections_select_public ON public.collections FOR SELECT TO anon, authenticated USING (deleted_at IS NULL AND status = 'active');
CREATE POLICY collections_select_staff ON public.collections FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY collections_insert_staff ON public.collections FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY collections_update_staff ON public.collections FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY collections_delete_super_admin ON public.collections FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));
CREATE INDEX collections_slug_idx ON public.collections (slug) WHERE deleted_at IS NULL;
CREATE INDEX collections_brand_idx ON public.collections (brand_id) WHERE deleted_at IS NULL;
CREATE INDEX collections_status_idx ON public.collections (status) WHERE deleted_at IS NULL;
CREATE INDEX collections_featured_idx ON public.collections (is_featured, sort_order) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX collections_season_year_idx ON public.collections (year DESC, season) WHERE deleted_at IS NULL;
CREATE INDEX collections_launch_idx ON public.collections (launch_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX collections_name_trgm_idx ON public.collections USING gin (name extensions.gin_trgm_ops);
CREATE TRIGGER collections_set_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- Migration 03b: Catalogue Hardening
-- =============================================================
CREATE TABLE public.season_types (
  code TEXT PRIMARY KEY, label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT season_types_code_format CHECK (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT season_types_label_not_empty CHECK (length(trim(label)) > 0)
);
GRANT SELECT ON public.season_types TO anon, authenticated;
GRANT ALL ON public.season_types TO service_role;
ALTER TABLE public.season_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY season_types_select_all ON public.season_types FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY season_types_insert_super_admin ON public.season_types FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY season_types_update_super_admin ON public.season_types FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY season_types_delete_super_admin ON public.season_types FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER season_types_set_updated_at BEFORE UPDATE ON public.season_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.season_types (code, label, sort_order) VALUES
  ('spring-summer','Spring Summer',10),('summer','Summer',20),('monsoon','Monsoon',30),
  ('autumn-winter','Autumn Winter',40),('winter','Winter',50),('festive','Festive',60),
  ('eid','Eid',70),('luxury','Luxury',80),('bridal','Bridal',90),('limited-edition','Limited Edition',100);

ALTER TABLE public.collections
  ADD CONSTRAINT collections_season_fk FOREIGN KEY (season) REFERENCES public.season_types(code) ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX collections_season_fk_idx ON public.collections (season) WHERE deleted_at IS NULL;

ALTER TABLE public.brands
  ADD CONSTRAINT brands_website_url_format CHECK (website_url IS NULL OR website_url ~* '^https?://'),
  ADD CONSTRAINT brands_logo_url_format CHECK (logo_url IS NULL OR logo_url ~* '^https?://'),
  ADD CONSTRAINT brands_hero_image_url_format CHECK (hero_image_url IS NULL OR hero_image_url ~* '^https?://');
ALTER TABLE public.categories
  ADD CONSTRAINT categories_image_url_format CHECK (image_url IS NULL OR image_url ~* '^https?://');
ALTER TABLE public.collections
  ADD CONSTRAINT collections_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~* '^https?://'),
  ADD CONSTRAINT collections_hero_image_url_format CHECK (hero_image_url IS NULL OR hero_image_url ~* '^https?://');