# Maintenance Runbook

## Routine Maintenance Tasks

### Weekly
- [ ] Review error tracking and monitoring dashboards for new issues
- [ ] Check Supabase and Vercel usage against plan quotas

### Monthly
- [ ] Review and apply dependency updates (`bun update`, verify no breaking changes)
- [ ] Run `bun audit` (or equivalent) for security vulnerabilities
- [ ] Review Supabase RLS policies against any new tables/features added
- [ ] Review access lists (Vercel team, Supabase dashboard) for stale accounts

### Quarterly
- [ ] Test a full backup restore (see `BACKUP_RECOVERY.md`)
- [ ] Review and update this runbook and related production-assets docs for accuracy
- [ ] Review hosting/plan tier against current traffic and growth

## Dependency Updates
1. Create a branch for the update.
2. Run `bun update` (or update specific packages).
3. Run `bun run build` and `bun run lint` locally to confirm nothing breaks.
4. Run through `QA_CHECKLIST.md` on a preview deployment before merging.
5. Merge and deploy following `RELEASE_PROCESS.md`.

## Database Maintenance
- Periodically review slow queries in Supabase dashboard and add indexes as needed (as a new migration, not a direct production edit).
- Periodically review storage bucket size and clean up orphaned/unused files if applicable.

## Certificate & Domain Maintenance
- [ ] Confirm SSL auto-renewal is functioning (Vercel-managed — verify certificate expiry dates periodically)
- [ ] Confirm domain registration auto-renew is enabled to avoid accidental lapse

## Planned Maintenance Windows
- For any maintenance expected to cause visible disruption (e.g. major Supabase migration), schedule during low-traffic hours and notify stakeholders in advance.

## Health Check Post-Maintenance
After any maintenance activity:
- [ ] Site loads correctly
- [ ] Auth flow works
- [ ] Core user flows function (list them specifically for this app)
- [ ] No new errors in monitoring dashboards within 30 minutes of the change
