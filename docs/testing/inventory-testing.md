# Inventory Testing Guide

## Overview

Test scenarios covering product stock/quantity tracking and its effect on catalog display and checkout.

> This should match the project's implementation for exact inventory decrement logic and thresholds (e.g., low-stock warnings).

## Test Scenarios

### Stock Display

- [ ] In-stock products display as purchasable
- [ ] Out-of-stock products are visually flagged and cannot be added to cart (or are otherwise handled per business rule)
- [ ] Low-stock products, if a threshold is implemented, display an appropriate indicator

### Stock Updates

- [ ] Placing an order decrements product quantity accordingly
- [ ] Cancelling/refunding an order restores quantity (if implemented)
- [ ] Admin manually adjusting stock via the admin UI reflects immediately in the storefront

### Concurrency

- [ ] Two near-simultaneous checkouts for the last unit of a product do not both succeed (oversell prevention) — confirm actual concurrency control (DB constraint, transaction, optimistic lock)

### Admin Inventory Management

- [ ] Admin can view current stock levels per product
- [ ] Admin can update stock levels directly
- [ ] Bulk inventory updates (if supported) apply correctly

## Related Documentation

- `../api/catalog.md`
- `checkout-testing.md`
- `../admin-guide/products.md`
