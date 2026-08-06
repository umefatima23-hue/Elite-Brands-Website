# Server / Hosting Setup

## Hosting Platform
- **Provider**: Vercel
- **Project type**: Static/SPA frontend (Vite + React), no custom Node server required
- **Framework preset**: Vite (explicitly — do not select Nitro, Cloudflare Workers, or Next.js presets)

## Vercel Project Configuration
| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `bun run build` |
| Output Directory | `dist` |
| Install Command | `bun install --frozen-lockfile` |
| Node/Bun version | Pin to the version used in local dev — set in Vercel project settings |

## SPA Routing
Since TanStack Router handles client-side routing, Vercel needs a rewrite rule so deep links don't 404:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This belongs in a **new** `vercel.json` at the project root if one does not already exist — do not add this to any protected config file.

## Supabase Backend
- Supabase project handles auth, database, and storage — no separate app server needed.
- Confirm the Supabase project region matches the primary user base for latency.
- Row Level Security (RLS) policies must be enabled on all production tables — verify in the Supabase dashboard under Authentication > Policies.
- Service role key is used **server-side only** (Vercel environment variable scoped appropriately) — never exposed to the client bundle.

## Domain & SSL
- [ ] Custom domain attached in Vercel project settings
- [ ] SSL certificate auto-provisioned and valid (Vercel handles this automatically)
- [ ] DNS records (A/CNAME) verified with registrar

## Scaling Considerations
- Vercel's edge network handles static asset scaling automatically.
- Supabase compute/connection limits should be reviewed against expected concurrent users — upgrade tier proactively before traffic spikes (e.g. sales campaigns, drops).

## Access Control
- [ ] Vercel team access limited to necessary personnel
- [ ] Supabase dashboard access limited and audited
- [ ] Service role key rotated on any personnel offboarding
