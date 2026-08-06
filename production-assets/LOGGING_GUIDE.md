# Logging Guide

## Log Sources
| Source | What It Captures | Where to View |
|---|---|---|
| Vercel Build Logs | Build/deploy success or failure, build-time errors | Vercel dashboard → Deployments |
| Vercel Runtime/Edge Logs | Request-level logs for serverless/edge functions (if any are added later) | Vercel dashboard → Logs |
| Supabase Logs | Database queries, auth events, API requests, storage operations | Supabase dashboard → Logs |
| Browser Console (client errors) | Unhandled exceptions, failed network requests | Frontend error tracking tool (see `MONITORING_CHECKLIST.md`) |

## Logging Principles
- **Never log secrets**: API keys, tokens, passwords, or full Supabase service role credentials must never appear in logs.
- **Structured over free-text**: prefer structured log entries (JSON) with consistent fields (timestamp, level, message, context) where custom logging is added.
- **Log levels**: use `error` for failures needing attention, `warn` for recoverable issues, `info` for significant events (deploy, auth events), `debug` only in non-production environments.
- **PII handling**: avoid logging full customer personal data (phone numbers, emails) in plaintext where avoidable — mask or truncate where possible.

## What to Log
- Authentication successes/failures (for security review)
- Failed API/database writes (for debugging data integrity issues)
- Deployment events (version, timestamp, who triggered it)
- Unhandled frontend exceptions with stack trace and release version

## What NOT to Log
- Raw request/response bodies containing customer data
- Any credential, key, or token value
- Full card/payment details (if payments are ever integrated — PCI scope)

## Log Retention
- [ ] Define retention window appropriate to plan limits (Supabase/Vercel log retention varies by tier)
- [ ] Export critical logs periodically if long-term retention is needed beyond platform defaults

## Accessing Logs During an Incident
1. Check Vercel deployment logs first for build/runtime failures.
2. Check Supabase logs for database/auth-layer issues.
3. Cross-reference timestamps with the monitoring alert that triggered the investigation.
4. Record findings in the incident log (`INCIDENT_RESPONSE.md`).
