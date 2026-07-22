
-- =========================================================================
-- MIGRATION 09 — AIRTABLE INTEGRATION FOUNDATION
-- =========================================================================

-- 1. ENUMS -----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.sync_direction AS ENUM (
    'airtable_to_supabase', 'supabase_to_airtable', 'bidirectional'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sync_status AS ENUM (
    'pending','syncing','success','failed','conflict','skipped'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.source_system AS ENUM (
    'supabase','airtable','whatsapp','manual','api','system'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sync_entity_type AS ENUM (
    'product','product_variant','supplier','brand','category',
    'collection','customer','order','inventory','product_image'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sync_conflict_type AS ENUM (
    'updated_in_both','missing_local','missing_remote',
    'duplicate','deleted_remote','deleted_local','schema_mismatch'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sync_conflict_status AS ENUM (
    'open','resolved_local','resolved_remote','resolved_manual','ignored'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. AIRTABLE CONNECTIONS --------------------------------------------------
CREATE TABLE public.airtable_connections (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  base_id        TEXT NOT NULL,
  description    TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  default_direction public.sync_direction NOT NULL DEFAULT 'airtable_to_supabase',
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at     TIMESTAMPTZ,
  CONSTRAINT airtable_connections_name_chk    CHECK (length(trim(name))    > 0),
  CONSTRAINT airtable_connections_base_id_chk CHECK (length(trim(base_id)) > 0),
  CONSTRAINT airtable_connections_base_uq UNIQUE (base_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airtable_connections TO authenticated;
GRANT ALL ON public.airtable_connections TO service_role;
ALTER TABLE public.airtable_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read connections"   ON public.airtable_connections FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert connections" ON public.airtable_connections FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update connections" ON public.airtable_connections FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Super admin delete connections" ON public.airtable_connections FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_airtable_connections_updated_at
  BEFORE UPDATE ON public.airtable_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_airtable_connections_active ON public.airtable_connections(is_active) WHERE deleted_at IS NULL;

-- 3. EXTERNAL ID MAPPING ---------------------------------------------------
CREATE TABLE public.airtable_external_ids (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id    UUID NOT NULL REFERENCES public.airtable_connections(id) ON DELETE RESTRICT,
  entity_type      public.sync_entity_type NOT NULL,
  entity_id        UUID NOT NULL,
  airtable_table   TEXT NOT NULL,
  airtable_record_id TEXT NOT NULL,
  last_synced_at   TIMESTAMPTZ,
  last_sync_hash   TEXT,
  last_source      public.source_system,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at       TIMESTAMPTZ,
  CONSTRAINT airtable_ext_table_chk  CHECK (length(trim(airtable_table))     > 0),
  CONSTRAINT airtable_ext_recid_chk  CHECK (length(trim(airtable_record_id)) > 0),
  CONSTRAINT airtable_ext_uq_remote  UNIQUE (connection_id, airtable_table, airtable_record_id),
  CONSTRAINT airtable_ext_uq_local   UNIQUE (connection_id, entity_type, entity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airtable_external_ids TO authenticated;
GRANT ALL ON public.airtable_external_ids TO service_role;
ALTER TABLE public.airtable_external_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read ext ids"   ON public.airtable_external_ids FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert ext ids" ON public.airtable_external_ids FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update ext ids" ON public.airtable_external_ids FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Super admin delete ext ids" ON public.airtable_external_ids FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_airtable_external_ids_updated_at
  BEFORE UPDATE ON public.airtable_external_ids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_ext_ids_entity     ON public.airtable_external_ids(entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ext_ids_airtable   ON public.airtable_external_ids(airtable_record_id)     WHERE deleted_at IS NULL;
CREATE INDEX idx_ext_ids_conn_type  ON public.airtable_external_ids(connection_id, entity_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_ext_ids_last_sync  ON public.airtable_external_ids(last_synced_at)          WHERE deleted_at IS NULL;

-- 4. SYNC LOG --------------------------------------------------------------
CREATE TABLE public.airtable_sync_log (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id      UUID REFERENCES public.airtable_connections(id) ON DELETE SET NULL,
  batch_id           UUID,
  entity_type        public.sync_entity_type NOT NULL,
  entity_id          UUID,
  airtable_table     TEXT,
  airtable_record_id TEXT,
  external_id_ref    UUID REFERENCES public.airtable_external_ids(id) ON DELETE SET NULL,
  direction          public.sync_direction NOT NULL,
  status             public.sync_status NOT NULL DEFAULT 'pending',
  source_system      public.source_system NOT NULL DEFAULT 'system',
  operation          TEXT NOT NULL DEFAULT 'upsert',
  is_bulk            BOOLEAN NOT NULL DEFAULT false,
  is_incremental     BOOLEAN NOT NULL DEFAULT true,
  idempotency_key    TEXT,
  request_hash       TEXT,
  payload_snapshot   JSONB,
  response_snapshot  JSONB,
  error_code         TEXT,
  error_message      TEXT,
  retry_count        INTEGER NOT NULL DEFAULT 0,
  max_retries        INTEGER NOT NULL DEFAULT 5,
  next_retry_at      TIMESTAMPTZ,
  last_error_at      TIMESTAMPTZ,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at       TIMESTAMPTZ,
  duration_ms        INTEGER,
  metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at         TIMESTAMPTZ,
  CONSTRAINT sync_log_operation_chk     CHECK (operation IN ('insert','update','upsert','delete','fetch','bulk')),
  CONSTRAINT sync_log_retry_chk         CHECK (retry_count >= 0 AND max_retries >= 0),
  CONSTRAINT sync_log_duration_chk      CHECK (duration_ms IS NULL OR duration_ms >= 0),
  CONSTRAINT sync_log_completed_chk     CHECK (completed_at IS NULL OR completed_at >= started_at),
  CONSTRAINT sync_log_idem_uq           UNIQUE (connection_id, idempotency_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airtable_sync_log TO authenticated;
GRANT ALL ON public.airtable_sync_log TO service_role;
ALTER TABLE public.airtable_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read sync log"   ON public.airtable_sync_log FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert sync log" ON public.airtable_sync_log FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update sync log" ON public.airtable_sync_log FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Super admin delete sync log" ON public.airtable_sync_log FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_airtable_sync_log_updated_at
  BEFORE UPDATE ON public.airtable_sync_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sync_log_status_next   ON public.airtable_sync_log(status, next_retry_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_sync_log_entity        ON public.airtable_sync_log(entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sync_log_airtable_rec  ON public.airtable_sync_log(airtable_record_id)     WHERE deleted_at IS NULL;
CREATE INDEX idx_sync_log_batch         ON public.airtable_sync_log(batch_id)               WHERE batch_id IS NOT NULL;
CREATE INDEX idx_sync_log_started_at    ON public.airtable_sync_log(started_at DESC);
CREATE INDEX idx_sync_log_conn_status   ON public.airtable_sync_log(connection_id, status);

-- 5. SYNC CURSORS (incremental watermarks) ---------------------------------
CREATE TABLE public.airtable_sync_cursors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id     UUID NOT NULL REFERENCES public.airtable_connections(id) ON DELETE CASCADE,
  entity_type       public.sync_entity_type NOT NULL,
  airtable_table    TEXT NOT NULL,
  direction         public.sync_direction NOT NULL,
  last_cursor       TEXT,
  last_synced_at    TIMESTAMPTZ,
  last_success_at   TIMESTAMPTZ,
  last_error_at     TIMESTAMPTZ,
  last_error        TEXT,
  records_processed BIGINT NOT NULL DEFAULT 0,
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at        TIMESTAMPTZ,
  CONSTRAINT sync_cursor_uq UNIQUE (connection_id, entity_type, airtable_table, direction)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airtable_sync_cursors TO authenticated;
GRANT ALL ON public.airtable_sync_cursors TO service_role;
ALTER TABLE public.airtable_sync_cursors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read cursors"   ON public.airtable_sync_cursors FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert cursors" ON public.airtable_sync_cursors FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update cursors" ON public.airtable_sync_cursors FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Super admin delete cursors" ON public.airtable_sync_cursors FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_airtable_sync_cursors_updated_at
  BEFORE UPDATE ON public.airtable_sync_cursors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sync_cursors_conn ON public.airtable_sync_cursors(connection_id, entity_type);

-- 6. CONFLICTS -------------------------------------------------------------
CREATE TABLE public.airtable_sync_conflicts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id      UUID REFERENCES public.airtable_connections(id) ON DELETE SET NULL,
  sync_log_id        UUID REFERENCES public.airtable_sync_log(id)   ON DELETE SET NULL,
  external_id_ref    UUID REFERENCES public.airtable_external_ids(id) ON DELETE SET NULL,
  entity_type        public.sync_entity_type NOT NULL,
  entity_id          UUID,
  airtable_table     TEXT,
  airtable_record_id TEXT,
  conflict_type      public.sync_conflict_type NOT NULL,
  status             public.sync_conflict_status NOT NULL DEFAULT 'open',
  local_snapshot     JSONB,
  remote_snapshot    JSONB,
  diff               JSONB,
  detected_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at        TIMESTAMPTZ,
  resolved_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes   TEXT,
  metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at         TIMESTAMPTZ,
  CONSTRAINT sync_conflict_resolved_chk CHECK (resolved_at IS NULL OR resolved_at >= detected_at)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airtable_sync_conflicts TO authenticated;
GRANT ALL ON public.airtable_sync_conflicts TO service_role;
ALTER TABLE public.airtable_sync_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read conflicts"   ON public.airtable_sync_conflicts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert conflicts" ON public.airtable_sync_conflicts FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update conflicts" ON public.airtable_sync_conflicts FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Super admin delete conflicts" ON public.airtable_sync_conflicts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_airtable_sync_conflicts_updated_at
  BEFORE UPDATE ON public.airtable_sync_conflicts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sync_conflicts_open    ON public.airtable_sync_conflicts(status) WHERE status = 'open' AND deleted_at IS NULL;
CREATE INDEX idx_sync_conflicts_entity  ON public.airtable_sync_conflicts(entity_type, entity_id);
CREATE INDEX idx_sync_conflicts_airtable ON public.airtable_sync_conflicts(airtable_record_id);
