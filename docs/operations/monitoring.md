# Monitoring

## Overview

Guidance on what to monitor for the storefront and admin application, given a Vercel + Supabase deployment.

> This should match the project's implementation for which monitoring tools (if any) are actually configured — this document describes what should be monitored, not confirmation that tooling is already in place.

## Application Monitoring

- **Uptime/availability:** Whether the deployed site (Vercel) and Supabase project are reachable.
- **Error tracking:** Client-side JavaScript errors (ideally captured via an error tracking tool such as Sentry, if integrated — confirm against the project).
- **Performance:** Core Web Vitals / Vercel Speed Insights, if enabled (see `../testing/performance-testing.md`).

## Backend Monitoring (Supabase)

- **Database health:** Connection counts, query latency, and error rates via the Supabase dashboard.
- **Auth activity:** Sign-up/login failure rates, which can indicate either UX issues or abuse.
- **Storage usage:** Bucket size growth over time, relevant to plan limits.

## Business Metrics (Admin-Relevant)

- Order volume and conversion rate (cart-to-order).
- Catalog health (out-of-stock rate, products without images).

These are candidates for the admin analytics view described in `../admin-guide/analytics.md`; whether they are currently implemented should match the project's implementation.

## Alerting

- Define alert thresholds for: deployment failures, elevated error rates, Supabase quota approaching limits.
- Actual alerting channels (email, Slack, etc.) should match the project's implementation.

## Related Documentation

- `incident-response.md`
- `../testing/performance-testing.md`
- `../admin-guide/analytics.md`
