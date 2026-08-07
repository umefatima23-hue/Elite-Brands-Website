# Rollback Guide

## Overview

Steps for reverting a problematic deployment on Vercel, and considerations for rolling back an associated Supabase schema change if one shipped alongside the code.

> This should match the project's implementation for any project-specific rollback tooling beyond what Vercel/Supabase provide natively.

## Application Rollback (Vercel)

1. Identify the last known-good deployment in the Vercel dashboard's deployment history.
2. Promote/redeploy that prior deployment as the current production deployment (Vercel supports instant rollback to any previous deployment).
3. Confirm via `../qa/smoke-tests.md` that the rolled-back deployment is healthy.
4. Communicate the rollback to the team and note the reason.

## Database Rollback (Supabase)

Rolling back schema changes is riskier than rolling back application code, since data may already have been written against the new schema.

1. Determine whether the problematic release included a Supabase migration.
2. If the migration is purely additive (new nullable columns/tables) and the application rollback doesn't depend on their removal, it may be safe to leave the schema as-is and only roll back the application code.
3. If the migration is breaking (column removed/renamed, constraint added) and must be reverted, prepare and apply a corresponding down-migration — this should follow whatever migration tooling the project uses (Supabase CLI migrations, if adopted).
4. Take a backup/snapshot before attempting any destructive schema rollback (see `backup-strategy.md`).

## Post-Rollback

- File an incident note per `incident-response.md` if the rollback was in response to a production issue.
- Identify root cause before re-attempting the release.

## Related Documentation

- `deployment-guide.md`
- `backup-strategy.md`
- `incident-response.md`
