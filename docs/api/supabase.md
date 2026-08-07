# Supabase Integration

## Overview

Supabase is the backend-as-a-service platform underpinning authentication, the relational database, and file storage for the Elite Brands Website. This document describes the conventional integration pattern for a React + Vite application using Supabase and should be reconciled against the actual client setup in `src/`.

> This should match the project's implementation. Environment variable names, client initialization code, and specific policy definitions were not inspected and must be confirmed against the repository.

## Components Used

- **Supabase Auth** — authentication and session management (see `authentication.md`)
- **Supabase Postgres Database** — relational data storage (see `database-overview.md`)
- **Supabase Storage** — file/image storage (see `storage.md`)
- Optionally, **Supabase Edge Functions** for server-side logic not suited to direct client access (e.g., privileged admin operations, payment webhook handling) — presence should match the project's implementation.

## Client Initialization (Conventional Pattern)

```ts
// Illustrative only — confirm actual location/config in src/
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Environment variables are typically injected via Vite's `import.meta.env` and configured per environment in Vercel project settings. Exact variable names should match the project's implementation.

## Row Level Security (RLS)

Supabase relies on PostgreSQL RLS policies to enforce authorization at the database layer, which is especially important since the client (browser) talks to the database using the public anon key plus the user's JWT.

Expected policy patterns:

| Table | Expected Policy |
|---|---|
| `products`, `brands`, `categories` | Public `SELECT`; `INSERT`/`UPDATE`/`DELETE` restricted to admin role |
| `orders` | `SELECT`/`INSERT` restricted to `customer_id = auth.uid()`; admin override for full access |
| `order_items` | Scoped through parent `orders` ownership |
| `profiles` | `SELECT`/`UPDATE` restricted to the owning user; admin override for read |

Actual policy SQL should be reviewed in the Supabase project dashboard or migration files. This should match the project's implementation.

## Realtime (If Used)

Supabase offers realtime subscriptions over database changes. Whether the admin dashboard or order tracking uses realtime subscriptions (e.g., live order status updates) is unconfirmed — this should match the project's implementation.

## Edge Functions (If Used)

If any operations require privileges beyond what RLS + anon key can safely provide client-side (e.g., sending emails, processing payments, admin bulk operations), these are conventionally implemented as Supabase Edge Functions invoked from the client. Presence and naming of such functions should match the project's implementation.

## Deployment Considerations

- Supabase project URL and keys are environment-specific and should be configured as Vercel environment variables per environment (production, preview).
- Database migrations should be applied to the corresponding Supabase project before or as part of deployment. See `../operations/deployment-guide.md`.

## Related Documentation

- `authentication.md`
- `database-overview.md`
- `storage.md`
- `../operations/deployment-guide.md`
