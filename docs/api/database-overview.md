# Database Architecture Overview

## Overview

The application's persistent data is expected to live in a Supabase-managed PostgreSQL database. This document describes the conventional schema shape implied by the catalog/orders/admin domains and should be reconciled against the actual migrations/schema in the `supabase/` directory of the project (not modified or read as part of producing this document).

> This should match the project's implementation. Table names, column types, constraints, and indexes below are illustrative and must be verified against the real schema.

## Expected Core Tables

| Table | Purpose |
|---|---|
| `brands` | Brand records shown in the catalog |
| `categories` | Product categories/taxonomy |
| `products` | Product catalog entries, linked to `brands` and `categories` |
| `orders` | Customer orders |
| `order_items` | Line items belonging to an order |
| `profiles` | Extended user data linked to `auth.users` (may include role/admin flag) |
| `auth.users` | Supabase-managed authentication table (not directly editable) |

## Expected Relationships

```
brands (1) ──< (many) products
categories (1) ──< (many) products
auth.users (1) ──< (1) profiles
auth.users (1) ──< (many) orders
orders (1) ──< (many) order_items
products (1) ──< (many) order_items
```

## Conventions

- **Primary keys:** UUIDs (`uuid`, typically `gen_random_uuid()` default), consistent with Supabase conventions.
- **Timestamps:** `created_at` / `updated_at` columns with `timestamptz` type, defaulting to `now()`.
- **Soft deletes vs. hard deletes:** Not confirmed — this should match the project's implementation.
- **Row Level Security:** Expected to be enabled on all user-facing tables, with policies scoping reads/writes by `auth.uid()` and role. See `supabase.md`.

## Indexing Considerations

For a catalog/orders application at this scale, the following indexes are typically expected (confirm against actual schema):

- `products(brand_id)`, `products(category_id)` — for filtered catalog queries
- `orders(customer_id)` — for "my orders" queries
- `order_items(order_id)` — for order detail joins
- A full-text search index (e.g., `pg_trgm` or `tsvector`) on `products(name, description)` if search is implemented at the database layer

## Migrations

Schema changes are expected to be tracked via Supabase migration files (typically under `supabase/migrations/`). This documentation does not modify or enumerate those files; refer to that directory directly for the authoritative, current schema.

## Related Documentation

- `supabase.md` — Supabase project configuration, RLS, and client usage
- `catalog.md` — catalog-facing read/write patterns over this schema
- `orders.md` — order lifecycle over this schema
- `storage.md` — file/image storage, which is separate from the relational schema
