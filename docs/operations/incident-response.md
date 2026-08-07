# Incident Response

## Overview

A lightweight incident response process for production issues affecting the storefront or admin application.

> This should match the project's implementation for team-specific escalation contacts and tooling, which are not defined in this document.

## Severity Levels (Suggested)

| Level | Description | Example |
|---|---|---|
| Sev 1 | Site down or checkout completely broken | Vercel deployment failing, Supabase outage, payment integration down |
| Sev 2 | Major feature degraded | Admin dashboard inaccessible, search broken |
| Sev 3 | Minor issue, workaround exists | Cosmetic UI bug, non-critical filter broken |

## Response Steps

1. **Detect** — via monitoring/alerting (`monitoring.md`) or user report.
2. **Triage** — assign a severity level and an owner.
3. **Communicate** — notify relevant stakeholders/team members; for Sev 1/2, consider a status update to users if the storefront is materially affected.
4. **Mitigate** — apply the fastest safe mitigation. This may be a rollback (`rollback-guide.md`) rather than a full fix.
5. **Resolve** — deploy a proper fix once mitigated, following `release-process.md`.
6. **Review** — write a brief post-incident note: what happened, root cause, and follow-up actions to prevent recurrence.

## Common Failure Modes to Anticipate

- Vercel deployment failure (build error) — rollback to last good deployment.
- Supabase outage or connectivity issue — check Supabase status page; degrade gracefully if possible (cached data, clear error messaging) rather than showing a blank page.
- RLS misconfiguration exposing or blocking data unexpectedly after a migration — verify policies immediately after any schema change (see `../qa/security-tests.md`).

## Related Documentation

- `rollback-guide.md`
- `monitoring.md`
- `../qa/security-tests.md`
