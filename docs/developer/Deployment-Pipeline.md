# Deployment Pipeline

## Overview

A developer-facing view of how code moves from a branch to a live deployment, complementing the operational runbook in `../operations/deployment-guide.md`.

> This should match the project's implementation. Actual Vercel project settings and any CI configuration were not inspected.

## Pipeline Stages (Conventional)

1. **Local development** — `bun install`, `bun run dev` (script name should match `package.json`), Vite dev server with HMR.
2. **Push / Pull Request** — pushing a branch (e.g., `feature/mobile1-admin-ui`) or opening a PR triggers a Vercel preview deployment automatically, assuming the Vercel GitHub integration is connected.
3. **Preview review** — reviewers/stakeholders can access the preview URL to validate changes before merge; run `../qa/smoke-tests.md` against the preview.
4. **Merge to main** — merging into the production branch triggers a production deployment on Vercel.
5. **Post-deploy verification** — smoke test the production URL; monitor per `../operations/monitoring.md`.

## Environment Variables

- Build-time environment variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are expected to be configured per-environment in the Vercel project settings, not committed to the repository.
- Preview and production environments may point to different Supabase projects — confirm this against `../operations/deployment-guide.md` and the actual Vercel configuration.

## Database Migrations in the Pipeline

- Supabase schema migrations are a separate concern from the Vercel code deployment — they must be applied to the target Supabase project independently (via Supabase CLI or dashboard), ideally as a step before or alongside the corresponding code deploy that depends on the new schema.
- Whether migrations are automated (e.g., via a CI step) or applied manually should match the project's implementation.

## Related Documentation

- `../operations/deployment-guide.md`
- `../operations/release-process.md`
- `../Versioning-Guide.md`
