# Admin API

## Overview

The Admin API covers the elevated-privilege operations exposed to administrator users through the admin UI (`feature/mobile1-admin-ui` and related admin surfaces). It layers on top of the Catalog and Orders APIs, adding write access, moderation, and management capabilities that are not available to regular customers.

> This should match the project's implementation. No admin route handlers or Supabase policies were inspected; the structure below documents the expected shape of an admin surface for this stack and should be reconciled against the actual code.

## Responsibilities

- Product, brand, and category management (create/update/delete)
- Order management (view all orders, update status, issue refunds/cancellations)
- Customer account visibility (view customer list, order history per customer)
- Dashboard/analytics data aggregation
- Admin-only settings and configuration

## Access Control

Admin API operations must only be reachable by users with an admin role. This is expected to be enforced through one (or a combination) of:

- A `role` or `is_admin` column/claim on the Supabase `auth.users` record or a linked `profiles` table
- Supabase Row Level Security policies that check the admin claim
- Route-level guards in the TanStack Router admin routes that redirect/deny non-admin users

This should match the project's implementation — the exact mechanism (custom claims, profiles table, or middleware) needs to be confirmed against the codebase.

## Conceptual Endpoints

| Area | Operation | Method | Path (convention) |
|---|---|---|---|
| Products | Create | POST | `/admin/products` |
| Products | Update | PATCH | `/admin/products/:id` |
| Products | Delete | DELETE | `/admin/products/:id` |
| Brands | Create/Update/Delete | POST/PATCH/DELETE | `/admin/brands[/:id]` |
| Categories | Create/Update/Delete | POST/PATCH/DELETE | `/admin/categories[/:id]` |
| Orders | List all | GET | `/admin/orders` |
| Orders | Update status | PATCH | `/admin/orders/:id/status` |
| Customers | List | GET | `/admin/customers` |
| Analytics | Summary metrics | GET | `/admin/analytics/summary` |

## Admin UI Considerations (Mobile Admin)

Given the active branch name (`feature/mobile1-admin-ui`), the admin interface is expected to have a mobile-responsive layout. Documentation-relevant implications:

- API responses consumed by the mobile admin UI should be paginated to avoid large payloads on constrained connections.
- Mutations triggered from mobile admin views should provide optimistic UI feedback with rollback on failure — this should match the project's implementation.

## Error Handling

| Scenario | Expected Behavior |
|---|---|
| Non-admin attempts admin action | 403 Forbidden |
| Admin action on non-existent resource | 404 |
| Concurrent edit conflict | 409 Conflict (if optimistic concurrency is implemented) |

## Related Documentation

- `catalog.md` — underlying product/brand/category data model
- `orders.md` — order lifecycle referenced by admin order management
- `authentication.md` — how admin sessions/roles are established
- `../admin-guide/dashboard.md` — end-user (admin) facing guide to the dashboard
