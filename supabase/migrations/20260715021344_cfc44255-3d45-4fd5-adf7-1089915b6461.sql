-- ============================================================
-- MIGRATION 10 (part A) — Airtable refinements
-- ============================================================
ALTER TABLE public.airtable_connections
  ADD COLUMN IF NOT EXISTS last_successful_sync_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sync_statistics JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_airtable_connections_last_success
  ON public.airtable_connections(last_successful_sync_at DESC NULLS LAST);

-- ============================================================
-- MIGRATION 10 — WhatsApp Commerce Foundation
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE public.whatsapp_conversation_status AS ENUM
    ('open','pending','waiting_customer','waiting_staff','snoozed','resolved','closed','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_conversation_topic AS ENUM
    ('general','product_inquiry','quote_request','order','support','complaint','shipping','payment','broadcast','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_channel AS ENUM ('click_to_chat','cloud_api','manual','campaign');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_message_direction AS ENUM ('inbound','outbound');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_message_type AS ENUM
    ('text','image','video','audio','document','sticker','location','contact','template','interactive','button','system','order','product','catalog');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_delivery_status AS ENUM
    ('queued','sent','delivered','read','failed','deleted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_template_category AS ENUM
    ('marketing','utility','authentication','service');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_template_status AS ENUM
    ('draft','pending','approved','rejected','paused','disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.whatsapp_campaign_status AS ENUM
    ('draft','scheduled','running','paused','completed','cancelled','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 1) whatsapp_templates
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  category public.whatsapp_template_category NOT NULL DEFAULT 'utility',
  status public.whatsapp_template_status NOT NULL DEFAULT 'draft',
  body TEXT NOT NULL,
  header TEXT,
  footer TEXT,
  buttons JSONB NOT NULL DEFAULT '[]'::jsonb,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  provider_template_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT whatsapp_templates_code_lang_unique UNIQUE (code, language_code),
  CONSTRAINT whatsapp_templates_name_check CHECK (length(trim(name)) > 0),
  CONSTRAINT whatsapp_templates_body_check CHECK (length(trim(body)) > 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_templates TO authenticated;
GRANT ALL ON public.whatsapp_templates TO service_role;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_templates_staff_read" ON public.whatsapp_templates
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "wa_templates_staff_write" ON public.whatsapp_templates
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_templates_staff_update" ON public.whatsapp_templates
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_templates_super_delete" ON public.whatsapp_templates
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_wa_templates_status ON public.whatsapp_templates(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_templates_category ON public.whatsapp_templates(category) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_wa_templates_updated_at
  BEFORE UPDATE ON public.whatsapp_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2) whatsapp_campaigns
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  status public.whatsapp_campaign_status NOT NULL DEFAULT 'draft',
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  audience_filter JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience_size INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT wa_campaigns_name_check CHECK (length(trim(name)) > 0),
  CONSTRAINT wa_campaigns_counts_check CHECK (
    sent_count >= 0 AND delivered_count >= 0 AND read_count >= 0
    AND reply_count >= 0 AND failed_count >= 0 AND audience_size >= 0
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_campaigns TO authenticated;
GRANT ALL ON public.whatsapp_campaigns TO service_role;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_campaigns_staff_read" ON public.whatsapp_campaigns
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "wa_campaigns_staff_write" ON public.whatsapp_campaigns
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_campaigns_staff_update" ON public.whatsapp_campaigns
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_campaigns_super_delete" ON public.whatsapp_campaigns
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_wa_campaigns_status ON public.whatsapp_campaigns(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_campaigns_scheduled_at ON public.whatsapp_campaigns(scheduled_at) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_wa_campaigns_updated_at
  BEFORE UPDATE ON public.whatsapp_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3) whatsapp_conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  wa_phone_e164 TEXT NOT NULL,
  wa_display_name TEXT,
  channel public.whatsapp_channel NOT NULL DEFAULT 'click_to_chat',
  topic public.whatsapp_conversation_topic NOT NULL DEFAULT 'general',
  status public.whatsapp_conversation_status NOT NULL DEFAULT 'open',
  subject TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  -- Reuse existing customer/order architecture
  related_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  related_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  related_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  quote_requested BOOLEAN NOT NULL DEFAULT false,
  -- Click-to-WhatsApp analytics
  source_url TEXT,
  entry_message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  campaign_id UUID REFERENCES public.whatsapp_campaigns(id) ON DELETE SET NULL,
  -- Provider identifiers for future Cloud API
  provider_conversation_id TEXT,
  provider_wa_id TEXT,
  -- Counters
  unread_count INTEGER NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  last_inbound_at TIMESTAMPTZ,
  last_outbound_at TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  internal_notes TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT wa_conv_phone_check CHECK (wa_phone_e164 ~ '^\+?[0-9]{8,15}$'),
  CONSTRAINT wa_conv_counts_check CHECK (unread_count >= 0 AND message_count >= 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_conversations TO authenticated;
GRANT ALL ON public.whatsapp_conversations TO service_role;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_conv_staff_read" ON public.whatsapp_conversations
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "wa_conv_staff_insert" ON public.whatsapp_conversations
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_conv_staff_update" ON public.whatsapp_conversations
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_conv_super_delete" ON public.whatsapp_conversations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_wa_conv_customer ON public.whatsapp_conversations(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_conv_phone ON public.whatsapp_conversations(wa_phone_e164) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_conv_status ON public.whatsapp_conversations(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_conv_assigned ON public.whatsapp_conversations(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_conv_last_message ON public.whatsapp_conversations(last_message_at DESC NULLS LAST) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_conv_order ON public.whatsapp_conversations(related_order_id) WHERE related_order_id IS NOT NULL;
CREATE INDEX idx_wa_conv_product ON public.whatsapp_conversations(related_product_id) WHERE related_product_id IS NOT NULL;
CREATE INDEX idx_wa_conv_campaign ON public.whatsapp_conversations(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_wa_conv_topic ON public.whatsapp_conversations(topic) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_wa_conv_provider ON public.whatsapp_conversations(provider_conversation_id)
  WHERE provider_conversation_id IS NOT NULL;

CREATE TRIGGER trg_wa_conv_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4) whatsapp_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  direction public.whatsapp_message_direction NOT NULL,
  message_type public.whatsapp_message_type NOT NULL DEFAULT 'text',
  channel public.whatsapp_channel NOT NULL DEFAULT 'click_to_chat',
  body TEXT,
  media_url TEXT,
  media_mime_type TEXT,
  media_size_bytes BIGINT,
  media_caption TEXT,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  template_variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  interactive_payload JSONB,
  -- Provider identifiers
  provider_message_id TEXT,
  provider_reply_to_id TEXT,
  reply_to_message_id UUID REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  -- Delivery lifecycle
  status public.whatsapp_delivery_status NOT NULL DEFAULT 'queued',
  error_code TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  -- Staff attribution (outbound)
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_automated BOOLEAN NOT NULL DEFAULT false,
  is_internal_note BOOLEAN NOT NULL DEFAULT false,
  -- Business linkage
  related_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  related_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.whatsapp_campaigns(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT wa_msg_body_or_media CHECK (
    body IS NOT NULL OR media_url IS NOT NULL OR template_id IS NOT NULL
    OR interactive_payload IS NOT NULL OR message_type = 'system'
  ),
  CONSTRAINT wa_msg_media_size_check CHECK (media_size_bytes IS NULL OR media_size_bytes >= 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_msg_staff_read" ON public.whatsapp_messages
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "wa_msg_staff_insert" ON public.whatsapp_messages
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_msg_staff_update" ON public.whatsapp_messages
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wa_msg_super_delete" ON public.whatsapp_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE INDEX idx_wa_msg_conversation ON public.whatsapp_messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_msg_direction ON public.whatsapp_messages(direction) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_msg_status ON public.whatsapp_messages(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wa_msg_campaign ON public.whatsapp_messages(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_wa_msg_order ON public.whatsapp_messages(related_order_id) WHERE related_order_id IS NOT NULL;
CREATE UNIQUE INDEX uq_wa_msg_provider ON public.whatsapp_messages(provider_message_id)
  WHERE provider_message_id IS NOT NULL;

CREATE TRIGGER trg_wa_msg_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5) whatsapp_conversation_events (audit / assignment / status)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_conversation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  from_value TEXT,
  to_value TEXT,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wa_conv_event_type_check CHECK (length(trim(event_type)) > 0)
);

GRANT SELECT, INSERT ON public.whatsapp_conversation_events TO authenticated;
GRANT ALL ON public.whatsapp_conversation_events TO service_role;
ALTER TABLE public.whatsapp_conversation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_conv_events_staff_read" ON public.whatsapp_conversation_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "wa_conv_events_staff_insert" ON public.whatsapp_conversation_events
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_wa_conv_events_conv ON public.whatsapp_conversation_events(conversation_id, created_at DESC);

-- ============================================================
-- 6) Trigger: keep conversation counters + timestamps in sync
-- ============================================================
CREATE OR REPLACE FUNCTION public.wa_messages_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_internal_note THEN
    RETURN NEW;
  END IF;

  UPDATE public.whatsapp_conversations c
     SET message_count   = message_count + 1,
         last_message_at = GREATEST(coalesce(c.last_message_at, NEW.created_at), NEW.created_at),
         last_inbound_at = CASE WHEN NEW.direction = 'inbound'
                                THEN GREATEST(coalesce(c.last_inbound_at, NEW.created_at), NEW.created_at)
                                ELSE c.last_inbound_at END,
         last_outbound_at = CASE WHEN NEW.direction = 'outbound'
                                 THEN GREATEST(coalesce(c.last_outbound_at, NEW.created_at), NEW.created_at)
                                 ELSE c.last_outbound_at END,
         unread_count = CASE WHEN NEW.direction = 'inbound'
                             THEN c.unread_count + 1 ELSE c.unread_count END,
         first_response_at = CASE
             WHEN NEW.direction = 'outbound' AND c.first_response_at IS NULL
             THEN NEW.created_at ELSE c.first_response_at END
   WHERE c.id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_wa_messages_after_insert
  AFTER INSERT ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION public.wa_messages_after_insert();
