# Environment Variables

> This file documents which variables the production environment needs. It does not contain actual secret values — populate real values only in Vercel's environment variable settings (or a local, gitignored `.env` for development).

## Frontend (exposed to client — must use the framework's public prefix, e.g. `VITE_`)
| Variable | Purpose | Required | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | Safe to expose client-side |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes | Safe to expose client-side; RLS enforces access control |

## Backend / Build-time only (never bundled into client code)
| Variable | Purpose | Required | Notes |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Elevated Supabase access for server-side operations | Yes | **Never** prefix with `VITE_` or reference in client code — this bypasses RLS |
| `SUPABASE_PROJECT_ID` | Project identifier for CLI/migrations | If using Supabase CLI | Used in CI/deploy scripts only |

## Environment Scoping in Vercel
- [ ] Production values set under **Production** scope
- [ ] Separate values (or a separate Supabase project) used for **Preview**/staging deployments
- [ ] No secret values committed to the repository, including in example files — use `.env.example` with placeholder names only

## Rotation Policy
- Rotate the Supabase service role key immediately if it is ever exposed (e.g. committed to Git, shared insecurely, or a team member offboards).
- Rotate the anon key only if abuse is detected (it's designed to be public but rate-limited/RLS-protected).

## Validation Before Deploy
- [ ] All required variables present in Vercel production environment
- [ ] No `VITE_`-prefixed variable contains a secret that should stay server-side
- [ ] Local `.env` is listed in `.gitignore` (verify without modifying `.gitignore` if it already covers this)
