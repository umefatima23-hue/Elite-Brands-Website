# Deployment Guide

## Stack Overview
- **Frontend**: Vite + React + TanStack Router (`routeTree.gen.ts` is auto-generated — never edit by hand)
- **Styling**: Tailwind CSS
- **Package manager**: Bun (`bun.lock`)
- **Backend / DB**: Supabase
- **Hosting**: Vercel

## Pre-Deployment Checklist
- [ ] All changes merged to the release branch via reviewed PR
- [ ] `bun install` runs clean (no lockfile drift)
- [ ] `bun run build` succeeds locally
- [ ] `bun run lint` passes
- [ ] Environment variables verified against `ENVIRONMENT_VARIABLES.md`
- [ ] Supabase migrations applied to staging and verified
- [ ] QA checklist completed (`QA_CHECKLIST.md`)

## Build Commands
```bash
bun install --frozen-lockfile
bun run build
```
Output directory: `dist/` (Vite default) — confirm against `vite.config.*` if this changes.

## Vercel Deployment Steps
1. Push to the connected Git branch (or run `vercel --prod` from an authorized machine).
2. Vercel auto-detects the Vite framework preset. **Do not use a Nitro/Cloudflare Workers preset** — this project has previously broken due to a preset mismatch causing load failures.
3. Confirm the build command in Vercel project settings matches `bun run build`.
4. Confirm the output directory setting matches Vite's `dist/`.
5. Set/verify all environment variables in Vercel project settings (see `ENVIRONMENT_VARIABLES.md`), including the Supabase service role key on the server side only.
6. Trigger deployment and monitor the build log for errors.

## Post-Deployment Verification
- [ ] Site loads on production URL (no blank/loading-spinner hang)
- [ ] Supabase auth flow works (login/session persistence)
- [ ] Key routes resolve correctly (TanStack Router)
- [ ] No console errors in browser devtools
- [ ] Check `MONITORING_CHECKLIST.md` for uptime/error tracking confirmation

## Rollback
1. In Vercel dashboard, go to the Deployments tab.
2. Select the last known-good deployment.
3. Click "Promote to Production."
4. If the issue is data-related (not code), see `BACKUP_RECOVERY.md`.

## Common Failure Modes
| Symptom | Likely Cause | Fix |
|---|---|---|
| Site stuck loading/blank | Wrong hosting preset (Nitro/Cloudflare Workers instead of static Vite) | Reset Vercel framework preset to Vite |
| Auth/data calls fail silently | Missing Supabase service role key or wrong env scope | Recheck `ENVIRONMENT_VARIABLES.md` |
| Routes 404 on refresh | SPA rewrite rule missing in Vercel config | Add catch-all rewrite to `index.html` |
