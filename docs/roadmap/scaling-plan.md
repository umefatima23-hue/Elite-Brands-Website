# Scaling Plan

## Overview

Considerations for scaling the Elite Brands Website as catalog size, order volume, or traffic grows, given the Vercel + Supabase architecture.

> This should match the project's implementation and actual Supabase/Vercel plan tiers, which determine current headroom.

## Frontend Scaling

- Vercel's edge network handles static asset and page scaling automatically; primary frontend scaling concerns are bundle size and client-side data-fetching efficiency (see `../testing/performance-testing.md`).
- As the admin UI grows (mobile admin work in `feature/mobile1-admin-ui` and beyond), monitor bundle size contributions from admin-only code paths — consider code-splitting admin routes from the public storefront bundle if not already done.

## Database Scaling (Supabase/Postgres)

- Monitor query performance as `products` and `orders` tables grow; ensure indexes described in `../api/database-overview.md` are in place and effective.
- Consider read replicas or connection pooling adjustments (Supabase supports PgBouncer-based pooling) if concurrent connection limits are approached.

## Storage Scaling

- Monitor Supabase Storage bucket sizes as product image counts grow; evaluate CDN/image optimization if load times degrade (see `../api/storage.md`).

## Search Scaling

- If catalog size grows significantly, evaluate moving from basic Postgres filtering/full-text search to a dedicated search service, per `phase-3.md` considerations.

## Order Volume Scaling

- Ensure the inventory decrement/oversell-prevention mechanism (see `../testing/inventory-testing.md`) remains correct under higher concurrency; this is a common bottleneck for growing e-commerce sites.

## Related Documentation

- `phase-3.md`
- `../testing/performance-testing.md`
- `../operations/monitoring.md`
