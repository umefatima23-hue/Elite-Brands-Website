
-- Refinement 1: Priority enum + column
DO $$ BEGIN
  CREATE TYPE public.wa_priority AS ENUM ('low','normal','high','urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.whatsapp_conversations
  ADD COLUMN IF NOT EXISTS priority public.wa_priority NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS sla_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS sla_breached boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_wa_conversations_priority
  ON public.whatsapp_conversations(priority)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_wa_conversations_sla_due
  ON public.whatsapp_conversations(sla_due_at)
  WHERE sla_breached = false AND sla_due_at IS NOT NULL AND deleted_at IS NULL;

-- Refinement 2: document standard tag labels (schema unchanged)
COMMENT ON COLUMN public.whatsapp_conversations.tags IS
  'Free-form TEXT[] tags. Recommended standard labels (not enforced): '
  '"VIP", "Wholesale", "Complaint", "Exchange", "Return", '
  '"Premium Outlet", "Pending Payment", "Repeat Customer". '
  'Additional custom tags allowed; keep casing consistent when possible.';

COMMENT ON COLUMN public.whatsapp_conversations.priority IS
  'Conversation priority for customer service workflows (low/normal/high/urgent). Default normal.';
COMMENT ON COLUMN public.whatsapp_conversations.sla_due_at IS
  'Optional SLA deadline for first/next response. Populated by future SLA automation.';
COMMENT ON COLUMN public.whatsapp_conversations.sla_breached IS
  'Set true when SLA deadline is missed. Future support dashboard uses this flag.';
