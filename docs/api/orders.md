# Orders API

## Overview

The Orders API governs the lifecycle of a customer order: creation at checkout, status updates, and retrieval for both the customer-facing order history and the admin order management views.

> This should match the project's implementation. No order schema or route implementation was inspected to produce this document; treat the structures below as the expected convention given the declared stack, and reconcile against the actual Supabase schema and any server functions in the repository.

## Responsibilities

- Create a new order from a checkout submission
- Attach order line items (products, quantities, prices at time of purchase)
- Track order status through its lifecycle (e.g., pending, paid, fulfilled, cancelled)
- Allow authenticated customers to view their own order history
- Allow admins to view, filter, and update any order (see `admin.md`)

## Conceptual Order Lifecycle

```
pending -> paid -> processing -> shipped -> delivered
                 \-> cancelled
                 \-> refunded
```

The exact state names and allowed transitions should match the project's implementation.

## Conceptual Endpoints

| Operation | Method | Path (convention) | Auth |
|---|---|---|---|
| Create order | POST | `/orders` | Authenticated customer |
| List my orders | GET | `/orders/mine` | Authenticated customer |
| Get order by ID | GET | `/orders/:id` | Owner or Admin |
| Update order status | PATCH | `/orders/:id/status` | Admin |
| List all orders | GET | `/orders` | Admin |

## Order Record (Conceptual Shape)

```json
{
  "id": "string (uuid)",
  "customer_id": "string (uuid, FK -> auth.users.id)",
  "status": "string (enum)",
  "items": [
    {
      "product_id": "string (uuid)",
      "quantity": "number",
      "unit_price": "number"
    }
  ],
  "subtotal": "number",
  "total": "number",
  "shipping_address": "object",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

Field names, currency handling, and tax/shipping calculation logic should match the project's implementation.

## Authorization Model

- A customer should only be able to read/write their own orders.
- Admin users should be able to read and update any order.
- This is expected to be enforced via Supabase Row Level Security policies scoped on `customer_id = auth.uid()`, with an admin bypass policy. This should match the project's implementation — confirm actual RLS policy definitions in the Supabase project/migrations.

## Checkout Flow (Conceptual)

1. Client assembles cart contents into an order payload.
2. Order is created in a `pending` (or equivalent) status.
3. Payment is processed (provider unknown — should match the project's implementation).
4. On payment confirmation, order status transitions to `paid`.
5. Admin or automated fulfillment process updates status through to `delivered`.

## Error Handling

| Scenario | Expected Behavior |
|---|---|
| Empty cart submitted | 400 validation error |
| Product out of stock at checkout | 409 conflict, order rejected or partially fulfilled per business rule |
| Unauthorized access to another user's order | 403 |
| Invalid status transition | 400 validation error |

## Related Documentation

- `admin.md` — admin order management operations
- `authentication.md` — how customer identity is established
- `database-overview.md` — orders table and relations
