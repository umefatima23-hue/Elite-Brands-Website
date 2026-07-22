
-- =====================================================================
-- MIGRATION 06 — CUSTOMERS + ORDERS FOUNDATION
-- =====================================================================

-- ---------- ENUM ADDITIONS (existing enums) ----------
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'draft' BEFORE 'pending';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'ready_to_dispatch' BEFORE 'dispatched';
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'wallet';
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'other';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'unpaid' BEFORE 'pending';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'partially_paid';

-- ---------- NEW ENUMS ----------
DO $$ BEGIN
  CREATE TYPE public.customer_status AS ENUM ('active','inactive','blocked','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.address_type AS ENUM ('shipping','billing','both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
