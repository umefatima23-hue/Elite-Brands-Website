
-- Enums
DO $$ BEGIN
  CREATE TYPE public.order_source_enum AS ENUM ('website','whatsapp','manual_admin','phone','facebook','instagram');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.contact_method_enum AS ENUM ('whatsapp','phone','email','sms');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Orders additions
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_source public.order_source_enum NOT NULL DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS whatsapp_conversation_id TEXT,
  ADD COLUMN IF NOT EXISTS quote_requested BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS internal_reference TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_order_source ON public.orders(order_source);
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp_conversation_id ON public.orders(whatsapp_conversation_id) WHERE whatsapp_conversation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_internal_reference ON public.orders(internal_reference) WHERE internal_reference IS NOT NULL;

-- Customers additions
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS preferred_contact_method public.contact_method_enum NOT NULL DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS whatsapp_last_contact TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_customers_preferred_contact_method ON public.customers(preferred_contact_method);
