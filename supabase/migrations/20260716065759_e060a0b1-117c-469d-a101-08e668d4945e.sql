
-- =========================================================
-- MIGRATION 11 — PRODUCTION OPERATIONS FOUNDATION
-- =========================================================

-- ============ ENUMS ============
DO $$ BEGIN CREATE TYPE public.audit_action AS ENUM
  ('insert','update','delete','soft_delete','restore','login','logout','export','import','role_change','permission_change','config_change','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.job_status AS ENUM
  ('queued','running','succeeded','failed','cancelled','retrying','dead_letter');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.job_priority AS ENUM ('low','normal','high','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.notification_channel AS ENUM
  ('in_app','email','sms','whatsapp','push','webhook');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.notification_status AS ENUM
  ('pending','queued','sending','sent','delivered','read','failed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.email_status AS ENUM
  ('pending','queued','sending','sent','delivered','bounced','failed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.webhook_status AS ENUM
  ('pending','sending','delivered','failed','retrying','dead_letter','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.log_severity AS ENUM
  ('debug','info','notice','warning','error','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.health_status AS ENUM ('healthy','degraded','down','unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role    text,
  action        public.audit_action NOT NULL,
  entity_type   text NOT NULL,
  entity_id     uuid,
  entity_pk     text,
  before_data   jsonb,
  after_data    jsonb,
  diff          jsonb,
  ip_address    inet,
  user_agent    text,
  request_id    text,
  session_id    text,
  source        text NOT NULL DEFAULT 'app',
  notes         text,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_entity_type_chk CHECK (length(trim(entity_type)) > 0)
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_staff_read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "audit_logs_authenticated_insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_metadata_gin ON public.audit_logs USING gin(metadata);

-- ============ USER ACTIVITY LOGS ============
CREATE TABLE public.user_activity_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type   text NOT NULL,
  path         text,
  entity_type  text,
  entity_id    uuid,
  ip_address   inet,
  user_agent   text,
  device       text,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.user_activity_logs TO authenticated;
GRANT ALL ON public.user_activity_logs TO service_role;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ual_self_read" ON public.user_activity_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "ual_self_insert" ON public.user_activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE INDEX idx_ual_user ON public.user_activity_logs(user_id, created_at DESC);
CREATE INDEX idx_ual_event ON public.user_activity_logs(event_type, created_at DESC);

-- ============ ADMIN ACTIVITY LOGS ============
CREATE TABLE public.admin_activity_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_role   text,
  action       text NOT NULL,
  entity_type  text,
  entity_id    uuid,
  summary      text,
  before_data  jsonb,
  after_data   jsonb,
  ip_address   inet,
  user_agent   text,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_activity_logs TO service_role;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aal_staff_read" ON public.admin_activity_logs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "aal_staff_insert" ON public.admin_activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_aal_admin ON public.admin_activity_logs(admin_id, created_at DESC);
CREATE INDEX idx_aal_entity ON public.admin_activity_logs(entity_type, entity_id);

-- ============ BACKGROUND JOBS ============
CREATE TABLE public.background_jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue           text NOT NULL DEFAULT 'default',
  job_type        text NOT NULL,
  status          public.job_status NOT NULL DEFAULT 'queued',
  priority        public.job_priority NOT NULL DEFAULT 'normal',
  payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
  result          jsonb,
  last_error      text,
  attempts        integer NOT NULL DEFAULT 0,
  max_attempts    integer NOT NULL DEFAULT 5,
  run_after       timestamptz NOT NULL DEFAULT now(),
  locked_at       timestamptz,
  locked_by       text,
  started_at      timestamptz,
  completed_at    timestamptz,
  next_retry_at   timestamptz,
  idempotency_key text,
  reference_type  text,
  reference_id    uuid,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT bj_type_chk CHECK (length(trim(job_type)) > 0),
  CONSTRAINT bj_attempts_chk CHECK (attempts >= 0 AND max_attempts >= 1),
  CONSTRAINT bj_idem_unique UNIQUE (queue, idempotency_key)
);
GRANT SELECT ON public.background_jobs TO authenticated;
GRANT ALL ON public.background_jobs TO service_role;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bj_staff_read" ON public.background_jobs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "bj_admin_write" ON public.background_jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_bj_queue_status_runafter ON public.background_jobs(queue, status, run_after)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_bj_status ON public.background_jobs(status);
CREATE INDEX idx_bj_reference ON public.background_jobs(reference_type, reference_id);
CREATE INDEX idx_bj_next_retry ON public.background_jobs(next_retry_at) WHERE status = 'retrying';
CREATE TRIGGER trg_bj_updated_at BEFORE UPDATE ON public.background_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SCHEDULED JOBS ============
CREATE TABLE public.scheduled_jobs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  description       text,
  job_type          text NOT NULL,
  cron_expression   text NOT NULL,
  timezone          text NOT NULL DEFAULT 'UTC',
  payload           jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active         boolean NOT NULL DEFAULT true,
  last_run_at       timestamptz,
  last_status       public.job_status,
  last_error        text,
  next_run_at       timestamptz,
  run_count         integer NOT NULL DEFAULT 0,
  failure_count     integer NOT NULL DEFAULT 0,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz,
  CONSTRAINT sj_name_unique UNIQUE (name)
);
GRANT SELECT ON public.scheduled_jobs TO authenticated;
GRANT ALL ON public.scheduled_jobs TO service_role;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sj_staff_read" ON public.scheduled_jobs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "sj_admin_write" ON public.scheduled_jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_sj_active_next ON public.scheduled_jobs(is_active, next_run_at)
  WHERE deleted_at IS NULL;
CREATE TRIGGER trg_sj_updated_at BEFORE UPDATE ON public.scheduled_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NOTIFICATION TEMPLATES ============
CREATE TABLE public.notification_templates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL,
  channel       public.notification_channel NOT NULL,
  locale        text NOT NULL DEFAULT 'en',
  subject       text,
  body          text NOT NULL,
  variables     jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active     boolean NOT NULL DEFAULT true,
  description   text,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT nt_code_channel_locale_unique UNIQUE (code, channel, locale),
  CONSTRAINT nt_body_chk CHECK (length(trim(body)) > 0)
);
GRANT SELECT ON public.notification_templates TO authenticated;
GRANT ALL ON public.notification_templates TO service_role;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nt_staff_read" ON public.notification_templates FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "nt_admin_write" ON public.notification_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_nt_code_channel ON public.notification_templates(code, channel) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_nt_updated_at BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NOTIFICATIONS (in-app + generic dispatch record) ============
CREATE TABLE public.notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  channel         public.notification_channel NOT NULL DEFAULT 'in_app',
  template_code   text,
  title           text,
  body            text,
  data            jsonb NOT NULL DEFAULT '{}'::jsonb,
  status          public.notification_status NOT NULL DEFAULT 'pending',
  is_read         boolean NOT NULL DEFAULT false,
  read_at         timestamptz,
  sent_at         timestamptz,
  delivered_at    timestamptz,
  failed_at       timestamptz,
  error_message   text,
  reference_type  text,
  reference_id    uuid,
  priority        public.job_priority NOT NULL DEFAULT 'normal',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_self_read" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "notif_self_update" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_staff_insert" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_notif_user_unread ON public.notifications(user_id, is_read, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_notif_status ON public.notifications(status);
CREATE INDEX idx_notif_reference ON public.notifications(reference_type, reference_id);
CREATE TRIGGER trg_notif_updated_at BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EMAIL QUEUE ============
CREATE TABLE public.email_queue (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_address      text NOT NULL,
  cc              text[] NOT NULL DEFAULT '{}',
  bcc             text[] NOT NULL DEFAULT '{}',
  from_address    text,
  reply_to        text,
  subject         text NOT NULL,
  body_html       text,
  body_text       text,
  template_code   text,
  template_data   jsonb NOT NULL DEFAULT '{}'::jsonb,
  status          public.email_status NOT NULL DEFAULT 'pending',
  attempts        integer NOT NULL DEFAULT 0,
  max_attempts    integer NOT NULL DEFAULT 5,
  scheduled_for   timestamptz NOT NULL DEFAULT now(),
  sent_at         timestamptz,
  delivered_at    timestamptz,
  failed_at       timestamptz,
  provider        text,
  provider_message_id text,
  last_error      text,
  reference_type  text,
  reference_id    uuid,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT eq_to_chk CHECK (length(trim(to_address)) > 0),
  CONSTRAINT eq_subject_chk CHECK (length(trim(subject)) > 0),
  CONSTRAINT eq_attempts_chk CHECK (attempts >= 0 AND max_attempts >= 1)
);
GRANT SELECT ON public.email_queue TO authenticated;
GRANT ALL ON public.email_queue TO service_role;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eq_staff_read" ON public.email_queue FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "eq_admin_write" ON public.email_queue FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_eq_status_scheduled ON public.email_queue(status, scheduled_for) WHERE deleted_at IS NULL;
CREATE INDEX idx_eq_reference ON public.email_queue(reference_type, reference_id);
CREATE TRIGGER trg_eq_updated_at BEFORE UPDATE ON public.email_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ WEBHOOK QUEUE ============
CREATE TABLE public.webhook_queue (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_url    text NOT NULL,
  http_method     text NOT NULL DEFAULT 'POST',
  headers         jsonb NOT NULL DEFAULT '{}'::jsonb,
  payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature_header text,
  secret_ref      text,
  status          public.webhook_status NOT NULL DEFAULT 'pending',
  attempts        integer NOT NULL DEFAULT 0,
  max_attempts    integer NOT NULL DEFAULT 8,
  scheduled_for   timestamptz NOT NULL DEFAULT now(),
  next_retry_at   timestamptz,
  last_attempt_at timestamptz,
  last_status_code integer,
  last_response_body text,
  last_error      text,
  reference_type  text,
  reference_id    uuid,
  event_type      text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT wq_url_chk CHECK (endpoint_url ~* '^https?://'),
  CONSTRAINT wq_method_chk CHECK (http_method IN ('GET','POST','PUT','PATCH','DELETE')),
  CONSTRAINT wq_attempts_chk CHECK (attempts >= 0 AND max_attempts >= 1)
);
GRANT SELECT ON public.webhook_queue TO authenticated;
GRANT ALL ON public.webhook_queue TO service_role;
ALTER TABLE public.webhook_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wq_staff_read" ON public.webhook_queue FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "wq_admin_write" ON public.webhook_queue FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_wq_status_scheduled ON public.webhook_queue(status, scheduled_for) WHERE deleted_at IS NULL;
CREATE INDEX idx_wq_event ON public.webhook_queue(event_type);
CREATE INDEX idx_wq_reference ON public.webhook_queue(reference_type, reference_id);
CREATE TRIGGER trg_wq_updated_at BEFORE UPDATE ON public.webhook_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GENERIC INTEGRATION EVENTS ============
CREATE TABLE public.integration_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration     text NOT NULL,
  direction       text NOT NULL,
  event_type      text NOT NULL,
  external_id     text,
  reference_type  text,
  reference_id    uuid,
  payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
  status          text NOT NULL DEFAULT 'received',
  error_message   text,
  processed_at    timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT ie_direction_chk CHECK (direction IN ('inbound','outbound')),
  CONSTRAINT ie_status_chk CHECK (status IN ('received','processing','processed','failed','skipped')),
  CONSTRAINT ie_integration_chk CHECK (length(trim(integration)) > 0)
);
GRANT SELECT ON public.integration_events TO authenticated;
GRANT ALL ON public.integration_events TO service_role;
ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ie_staff_read" ON public.integration_events FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "ie_admin_write" ON public.integration_events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_ie_integration_event ON public.integration_events(integration, event_type, created_at DESC);
CREATE INDEX idx_ie_external ON public.integration_events(integration, external_id);
CREATE INDEX idx_ie_reference ON public.integration_events(reference_type, reference_id);
CREATE TRIGGER trg_ie_updated_at BEFORE UPDATE ON public.integration_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ FEATURE FLAGS ============
CREATE TABLE public.feature_flags (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key             text NOT NULL UNIQUE,
  description     text,
  is_enabled      boolean NOT NULL DEFAULT false,
  rollout_percent integer NOT NULL DEFAULT 0,
  audience        jsonb NOT NULL DEFAULT '{}'::jsonb,
  environment     text NOT NULL DEFAULT 'production',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT ff_rollout_chk CHECK (rollout_percent BETWEEN 0 AND 100),
  CONSTRAINT ff_key_chk CHECK (length(trim(key)) > 0)
);
GRANT SELECT ON public.feature_flags TO authenticated;
GRANT ALL ON public.feature_flags TO service_role;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ff_authenticated_read" ON public.feature_flags FOR SELECT TO authenticated USING (true);
CREATE POLICY "ff_admin_write" ON public.feature_flags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_ff_updated_at BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ APPLICATION SETTINGS (key/value, typed) ============
CREATE TABLE public.application_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text NOT NULL UNIQUE,
  value         jsonb NOT NULL DEFAULT '{}'::jsonb,
  value_type    text NOT NULL DEFAULT 'json',
  category      text,
  description   text,
  is_secret     boolean NOT NULL DEFAULT false,
  is_public     boolean NOT NULL DEFAULT false,
  environment   text NOT NULL DEFAULT 'production',
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT as_key_chk CHECK (length(trim(key)) > 0),
  CONSTRAINT as_value_type_chk CHECK (value_type IN ('string','number','boolean','json','array'))
);
GRANT SELECT ON public.application_settings TO authenticated;
GRANT ALL ON public.application_settings TO service_role;
ALTER TABLE public.application_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "as_public_read" ON public.application_settings FOR SELECT TO authenticated
  USING (is_public = true OR public.is_staff(auth.uid()));
CREATE POLICY "as_admin_write" ON public.application_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_as_category ON public.application_settings(category) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_as_updated_at BEFORE UPDATE ON public.application_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SYSTEM HEALTH ============
CREATE TABLE public.system_health_checks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component     text NOT NULL,
  status        public.health_status NOT NULL DEFAULT 'unknown',
  latency_ms    integer,
  message       text,
  details       jsonb NOT NULL DEFAULT '{}'::jsonb,
  checked_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shc_component_chk CHECK (length(trim(component)) > 0)
);
GRANT SELECT ON public.system_health_checks TO authenticated;
GRANT ALL ON public.system_health_checks TO service_role;
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shc_staff_read" ON public.system_health_checks FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE INDEX idx_shc_component_checked ON public.system_health_checks(component, checked_at DESC);

-- ============ MAINTENANCE MODE ============
CREATE TABLE public.maintenance_windows (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  message         text,
  is_active       boolean NOT NULL DEFAULT false,
  allow_staff     boolean NOT NULL DEFAULT true,
  scheduled_start timestamptz,
  scheduled_end   timestamptz,
  started_at      timestamptz,
  ended_at        timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT mw_title_chk CHECK (length(trim(title)) > 0)
);
GRANT SELECT ON public.maintenance_windows TO authenticated;
GRANT SELECT ON public.maintenance_windows TO anon;
GRANT ALL ON public.maintenance_windows TO service_role;
ALTER TABLE public.maintenance_windows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mw_public_read_active" ON public.maintenance_windows FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);
CREATE POLICY "mw_admin_write" ON public.maintenance_windows FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_mw_active ON public.maintenance_windows(is_active) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_mw_updated_at BEFORE UPDATE ON public.maintenance_windows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ API RATE LIMIT FOUNDATION ============
CREATE TABLE public.api_rate_limits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope         text NOT NULL,
  identifier    text NOT NULL,
  endpoint      text,
  window_start  timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  window_seconds integer NOT NULL DEFAULT 60,
  request_count integer NOT NULL DEFAULT 0,
  limit_value   integer NOT NULL DEFAULT 60,
  last_request_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT arl_scope_chk CHECK (scope IN ('ip','user','api_key','session','other')),
  CONSTRAINT arl_count_chk CHECK (request_count >= 0),
  CONSTRAINT arl_limit_chk CHECK (limit_value >= 1),
  CONSTRAINT arl_unique UNIQUE (scope, identifier, endpoint, window_start)
);
GRANT SELECT ON public.api_rate_limits TO authenticated;
GRANT ALL ON public.api_rate_limits TO service_role;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "arl_staff_read" ON public.api_rate_limits FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE INDEX idx_arl_lookup ON public.api_rate_limits(scope, identifier, window_start DESC);
CREATE INDEX idx_arl_blocked ON public.api_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;
CREATE TRIGGER trg_arl_updated_at BEFORE UPDATE ON public.api_rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ERROR LOGS ============
CREATE TABLE public.error_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity      public.log_severity NOT NULL DEFAULT 'error',
  source        text NOT NULL DEFAULT 'app',
  environment   text NOT NULL DEFAULT 'production',
  error_code    text,
  message       text NOT NULL,
  stack_trace   text,
  context       jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  request_id    text,
  route         text,
  http_status   integer,
  fingerprint   text,
  resolved      boolean NOT NULL DEFAULT false,
  resolved_at   timestamptz,
  resolved_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT el_message_chk CHECK (length(trim(message)) > 0)
);
GRANT SELECT, INSERT ON public.error_logs TO authenticated;
GRANT ALL ON public.error_logs TO service_role;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "el_staff_read" ON public.error_logs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "el_authenticated_insert" ON public.error_logs FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "el_admin_update" ON public.error_logs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE INDEX idx_el_severity_created ON public.error_logs(severity, created_at DESC);
CREATE INDEX idx_el_fingerprint ON public.error_logs(fingerprint) WHERE fingerprint IS NOT NULL;
CREATE INDEX idx_el_unresolved ON public.error_logs(created_at DESC) WHERE resolved = false AND deleted_at IS NULL;
CREATE TRIGGER trg_el_updated_at BEFORE UPDATE ON public.error_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
