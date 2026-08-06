# Backup & Recovery

## What Needs Backing Up
1. **Supabase database** (tables, RLS policies, functions, triggers)
2. **Supabase storage buckets** (uploaded assets/images)
3. **Application source code** (Git — already versioned; ensure remote is not solely local)
4. **Environment variable configuration** (documented in `ENVIRONMENT_VARIABLES.md`, actual values stored in a secure secrets manager or password manager, not in plaintext files)

## Database Backups (Supabase)
- Supabase Pro+ plans include automated daily backups with point-in-time recovery (PITR) — confirm current plan supports the retention window your business needs.
- **Manual backup** (recommended before any risky migration or bulk data operation):
  ```bash
  supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql
  ```
- Store manual dumps in a secure, access-controlled location (not in the Git repo).

## Storage Bucket Backups
- Periodically export/sync Supabase storage buckets to an external location (e.g. cloud storage) if bucket contents are business-critical (product images, brand assets).

## Recovery Procedure
1. **Identify scope**: code issue, data issue, or both.
2. **Code issue** → Rollback via Vercel (see `DEPLOYMENT_GUIDE.md` → Rollback).
3. **Data issue**:
   - If within Supabase's PITR window, restore to a timestamp before the incident via the Supabase dashboard.
   - If using manual dumps, restore via:
     ```bash
     psql <connection_string> -f backup_YYYYMMDD_HHMMSS.sql
     ```
   - Always restore to a **staging/test project first** to verify integrity before touching production.
4. **Verify** application functionality end-to-end post-recovery (auth, reads, writes).
5. **Document** the incident in an entry under `INCIDENT_RESPONSE.md`.

## Backup Testing Cadence
- [ ] Quarterly: perform a test restore from a manual backup to confirm the dump/restore process actually works
- [ ] After any major schema migration: take an ad-hoc backup immediately before applying

## Recovery Time Objective (RTO) / Recovery Point Objective (RPO)
Define and record target values here based on business tolerance, e.g.:
- RTO: time to restore service after an incident
- RPO: maximum acceptable data loss window
