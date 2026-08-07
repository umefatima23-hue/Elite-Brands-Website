# Edge Cases

## Overview

A catalog of edge cases worth explicit testing across the storefront and admin surfaces, beyond the happy-path scenarios in `manual-test-cases.md`.

> Expected/actual behavior for several items below is unconfirmed and should match the project's implementation.

## Catalog

- Product with no images assigned.
- Product with a price of `0`.
- Product with an extremely long name/description (layout overflow).
- Category or brand with zero associated products.
- Simultaneous filters that result in zero matches.

## Cart & Checkout

- Adding the same product to the cart multiple times (quantity aggregation vs. duplicate line items).
- Cart item that goes out of stock while sitting in the cart before checkout.
- Checkout attempted with an empty cart (should be blocked).
- Network failure mid-checkout submission (does an order get partially created?).
- Rapid double-submission of the checkout form.

## Authentication

- Sign-up with an email that already exists but is unverified.
- Login attempt during an active session (should reuse or refresh, not error).
- Session expiry precisely during a form submission (e.g., placing an order).
- Admin role revoked while the admin has an active session — does access get revoked immediately or only on next login?

## Admin

- Deleting a brand/category that still has associated products.
- Editing a product concurrently by two admins (last write wins vs. conflict detection).
- Uploading a very large image file or an unsupported file type for a product image.
- Setting negative or non-numeric stock quantity via the admin form.

## Orders

- Order placed for a product that is deleted afterward — how is it displayed in order history?
- Order status changed to an invalid/unsupported value via direct API call (bypassing UI).
- Refund/cancellation after an order has already shipped (if applicable to business rules).

## Related Documentation

- `manual-test-cases.md`
- `security-tests.md`
- `../testing/inventory-testing.md`
