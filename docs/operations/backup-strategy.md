# Backup Strategy

## Overview

Backup considerations for the two main categories of persisted data: the Supabase Postgres database and Supabase Storage (uploaded images/assets).

> This should match the project's implementation and the actual Supabase plan tier in use, which determines what backup capabilities are available/enabled by default.

## Database Backups

- Supabase provides automatic daily backups on paid plans, with point-in-time recovery (PITR) available on higher tiers. Confirm which tier the project's Supabase instance is on, and whether PITR is enabled.
- Before any risky operation (schema migration, bulk data edit, manual admin data fix), consider taking a manual backup/snapshot via the Supabase dashboard or `pg_dump`, if the plan/tooling allows.

## Storage Backups

- Supabase Storage objects (product images, brand assets) should be considered alongside database backups — a database restore without a corresponding storage state can leave dangling references to missing files.
- Confirm whether the project has any separate backup/export process for Storage buckets. This should match the project's implementation.

## Backup Verification

- Periodically verify that backups are restorable, not just that they exist (a backup that has never been test-restored is not a reliable backup).

## Retention

- Retention period for backups should match the Supabase plan's default retention, unless a custom retention/export process has been implemented. This should match the project's implementation.

## Related Documentation

- `rollback-guide.md`
- `../api/database-overview.md`
- `../api/storage.md`
