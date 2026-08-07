# Catalog API

## Overview

The Catalog API is responsible for exposing product, brand, and category data to the storefront and admin interfaces of the Elite Brands Website. It is the primary read (and, for admin flows, write) surface for anything a shopper or administrator sees related to product listings.

> This should match the project's implementation. The exact endpoint paths, request/response shapes, and query parameters below are a documented convention based on the declared stack (React, TanStack Router, Supabase). They should be verified and reconciled against the actual data-access layer in `src/` before being treated as a contract.

## Responsibilities

- List and filter products (by brand, category, price range, availability, tags)
- Fetch a single product's full detail record
- List brands and categories used for navigation and filtering
- Support search/autocomplete queries against the catalog
- Support admin create/update/delete operations on products, brands, and categories (see `admin.md` for admin-specific concerns such as authorization)

## Data Access Pattern

The catalog is expected to be backed by Supabase (PostgreSQL) tables, queried either:

1. Directly from the client via the Supabase JS client, using Row Level Security (RLS) policies to scope what anonymous/authenticated users can read, or
2. Through server-side/edge functions that wrap Supabase queries for cases needing elevated privileges (e.g., admin writes).

This should match the project's implementation — confirm whether catalog reads happen client-side against Supabase directly, or through an intermediary API layer.

## Conceptual Endpoints

| Operation | Method | Path (convention) | Auth |
|---|---|---|---|
| List products | GET | `/products` | Public |
| Get product by ID/slug | GET | `/products/:id` | Public |
| List brands | GET | `/brands` | Public |
| Get brand by ID/slug | GET | `/brands/:id` | Public |
| List categories | GET | `/categories` | Public |
| Search products | GET | `/products/search?q=` | Public |
| Create product | POST | `/products` | Admin |
| Update product | PATCH | `/products/:id` | Admin |
| Delete product | DELETE | `/products/:id` | Admin |

If the project uses Supabase's auto-generated REST/PostgREST API or RPC functions instead of hand-written routes, these conceptual paths map to Supabase table/RPC calls rather than custom server routes. This should match the project's implementation.

## Product Record (Conceptual Shape)

```json
{
  "id": "string (uuid)",
  "name": "string",
  "slug": "string",
  "description": "string",
  "price": "number",
  "brand_id": "string (uuid, FK -> brands.id)",
  "category_id": "string (uuid, FK -> categories.id)",
  "images": ["string (storage URL)"],
  "in_stock": "boolean",
  "quantity": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

The exact column names, types, and nullability constraints should match the project's implementation (see `database-overview.md` and the Supabase schema).

## Filtering & Pagination

Catalog listing endpoints are expected to support:

- Pagination via `limit`/`offset` or cursor-based paging (Supabase `.range()`)
- Filtering by `brand_id`, `category_id`, `in_stock`
- Sorting by `price`, `created_at`, `name`

This should match the project's implementation for exact parameter names and defaults.

## Error Handling

| Scenario | Expected Behavior |
|---|---|
| Product not found | 404 / empty result set |
| Invalid filter parameter | 400 / validation error surfaced to client |
| Unauthorized write attempt | 401/403 via Supabase RLS or route guard |

## Related Documentation

- `admin.md` — admin-only catalog mutation endpoints
- `database-overview.md` — underlying schema
- `supabase.md` — Supabase client and RLS conventions
- `storage.md` — how product images are stored and served
