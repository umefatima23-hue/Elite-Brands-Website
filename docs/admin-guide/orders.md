# Admin Guide: Orders

## Overview

How administrators view and manage customer orders through the admin UI.

> This should match the project's implementation for exact UI fields and available status transitions.

## Viewing Orders

- Orders list view shows all orders, expected to be filterable by status and searchable by customer or order ID.
- Selecting an order shows full detail: line items, customer info, shipping address, and current status.

## Updating Order Status

- Admins can update an order's status (e.g., from `pending` to `paid`, `shipped`, `delivered`, or `cancelled`), consistent with the lifecycle described in `../api/orders.md`.
- Status changes should be reflected immediately in the customer's own order history view.

## Mobile Considerations

On the mobile admin layout, the orders list is expected to condense into a card-based view rather than a wide table, with order detail accessible via tap-through. This should match the project's implementation.

## Related Documentation

- `../api/orders.md`
- `../testing/admin-testing.md`
- `dashboard.md`
