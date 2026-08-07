# Checkout Testing Guide

## Overview

Test scenarios for the customer-facing checkout flow, from cart to order confirmation.

> This should match the project's implementation for the actual checkout steps, payment provider, and validation rules.

## Scope

- Cart to checkout transition
- Address and shipping input
- Payment submission (provider TBD — should match the project's implementation)
- Order confirmation and receipt

## Test Scenarios

### Cart

- [ ] Adding a product to the cart updates the cart count/summary
- [ ] Updating quantity in the cart recalculates subtotal correctly
- [ ] Removing an item from the cart updates totals correctly
- [ ] Cart persists across page reloads (if implemented — confirm expected persistence mechanism)

### Checkout Form

- [ ] Required fields (name, address, etc.) are validated before submission
- [ ] Invalid email/phone formats are rejected with a clear error
- [ ] Shipping address and billing address can differ (if supported)

### Payment

- [ ] Successful payment transitions the order to a paid/confirmed state
- [ ] Failed/declined payment surfaces an error without creating a false "confirmed" order
- [ ] Duplicate submission (double-click "Place Order") does not create duplicate orders

### Stock & Inventory Interaction

- [ ] Checkout of an item that goes out of stock between cart-add and checkout is handled gracefully (see `inventory-testing.md`)

### Confirmation

- [ ] Order confirmation page/email displays correct items, quantities, and totals
- [ ] Order appears in the customer's order history immediately after placement

## Related Documentation

- `../api/orders.md`
- `inventory-testing.md`
- `../qa/edge-cases.md`
