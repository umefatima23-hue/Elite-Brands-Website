# Security Checklist

## Supabase / Database
- [ ] Row Level Security (RLS) enabled on **every** table containing user or business data
- [ ] RLS policies tested with a non-privileged (anon) role, not just the service role
- [ ] Service role key never referenced in any client-side (`VITE_`-prefixed) code or bundle
- [ ] Database backups encrypted at rest (Supabase default — confirm plan tier)
- [ ] Least-privilege: no shared "god mode" accounts for team members who only need read access

## Authentication
- [ ] Password policy enforced (minimum length/complexity) if using email/password auth
- [ ] Session expiry configured appropriately (not indefinite for sensitive dashboards)
- [ ] Multi-factor authentication (MFA) enabled for admin/owner accounts on Supabase and Vercel dashboards themselves

## Application
- [ ] No secrets, API keys, or credentials committed to Git history (run a secret scan before first production release)
- [ ] Dependencies audited for known vulnerabilities (`bun audit` or equivalent) before each release
- [ ] Content Security Policy (CSP) headers configured to restrict script/style sources
- [ ] All external links use `rel="noopener noreferrer"` where `target="_blank"` is used
- [ ] Input validation on all forms that write to Supabase (client-side is UX only — RLS/policies are the real gate)

## Infrastructure
- [ ] HTTPS enforced (Vercel default — confirm no mixed-content warnings)
- [ ] Vercel/Supabase account access limited to necessary team members, reviewed quarterly
- [ ] MFA enabled on all hosting/platform accounts (Vercel, Supabase, domain registrar)
- [ ] Environment variables scoped correctly between Production/Preview (see `ENVIRONMENT_VARIABLES.md`)

## Ongoing
- [ ] Dependency updates reviewed monthly, security patches applied promptly
- [ ] Security checklist re-run before every production release (link from `RELEASE_PROCESS.md`)
- [ ] Incident response plan understood by all team members with production access (`INCIDENT_RESPONSE.md`)

## Data Privacy
- [ ] Customer/business data handled per applicable regional privacy expectations
- [ ] Data retention policy defined for logs and backups (avoid indefinite retention of sensitive data)
