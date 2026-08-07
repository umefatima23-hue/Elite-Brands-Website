# Deployment Guide

## Overview

The Elite Brands Website is expected to be deployed on **Vercel**, built with **Vite**, and dependent on a live **Supabase** backend. This guide describes the conventional deployment flow for this stack.

> This should match the project's implementation. Actual Vercel project configuration, build commands, and environment variables must be confirmed directly in the Vercel dashboard/project settings.

## Prerequisites

- A Vercel project linked to this repository
- A Supabase project (or separate projects per environment) with schema migrations applied
- Required environment variables configured in Vercel (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — exact names should match the project's implementation)

## Build & Output

- **Package manager:** Bun (per `bun.lock`)
- **Build command:** Expected to be a Vite production build (e.g., `bun run build`) — confirm actual script name in `package.json`
- **Output directory:** Vite's default `dist/` unless configured otherwise in `vite.config.*`

This document does not modify or read `package.json`/`vite.config.*` directly; confirm exact scripts there.

## Environments

| Environment | Trigger (convention) | Notes |
|---|---|---|
| Production | Push/merge to main branch | Should point to the production Supabase project |
| Preview | Pull request / feature branch push | Vercel preview deployments; should point to a staging/dev Supabase project if isolated environments are used |

Whether staging uses a separate Supabase project or shares the production project should match the project's implementation — sharing is a risk worth flagging if confirmed (see `../roadmap/technical-debt.md`).

## Deployment Steps (Conventional)

1. Ensure the target branch is up to date and has passed CI/regression checks (see `../testing/regression-testing.md`).
2. Confirm any pending Supabase migrations are applied to the target Supabase project.
3. Push/merge to the branch Vercel is configured to deploy from.
4. Vercel builds and deploys automatically.
5. Run smoke tests against the deployed URL (see `../qa/smoke-tests.md`).

## Rollback

See `rollback-guide.md` for reverting a bad deployment.

## Related Documentation

- `release-process.md`
- `rollback-guide.md`
- `../api/supabase.md`
- `../qa/smoke-tests.md`
