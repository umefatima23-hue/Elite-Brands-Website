# Acceptance Criteria

## Overview

Baseline acceptance criteria for the core features of the Elite Brands Website. These are written as general, stack-appropriate criteria and should be refined with feature-specific detail as each feature's actual implementation is confirmed.

> This should match the project's implementation for any feature-specific business rules not captured here.

## Catalog Browsing

- Given a shopper on the catalog page, when the page loads, then products are displayed with name, price, and image.
- Given a shopper applies a brand or category filter, when the filter is applied, then only matching products are shown.
- Given a shopper searches for a product, when results are returned, then only relevant matches are shown, or a clear empty state is displayed.

## Product Detail

- Given a shopper views a product detail page, when the page loads, then the product's full description, price, images, and stock status are visible.
- Given a product is out of stock, when a shopper views it, then the UI clearly communicates unavailability and does not allow add-to-cart.

## Cart & Checkout

- Given a shopper adds a product to their cart, when they view the cart, then the item, quantity, and price are correctly reflected.
- Given a shopper completes checkout with valid information and payment, when the order is submitted, then an order is created and confirmation is shown.
- Given a shopper submits checkout with invalid/missing required information, when they submit, then validation errors are shown and no order is created.

## Authentication

- Given a new user registers with valid credentials, when they submit, then an account is created and they are signed in (or prompted to verify email, per implementation).
- Given a user attempts to access an admin route without admin privileges, when they navigate there, then they are denied access.

## Admin — Catalog Management

- Given an admin creates a new product with valid data, when submitted, then the product appears in the storefront catalog.
- Given an admin deletes a product, when confirmed, then the product no longer appears in the storefront catalog.

## Admin — Order Management

- Given an admin updates an order's status, when saved, then the new status is reflected both in the admin view and the customer's order history.

## Admin — Customers, Analytics, and Settings

- Given an admin views the customers list, when the page loads, then registered customers are shown with basic profile info and no sensitive account fields.
- Given an admin views the analytics dashboard, when the page loads, then summary metrics are shown, reflecting actual order/catalog data — needs verification against current implementation for exact metrics.
- Given an admin views settings, when the page loads, then settings are shown and editable only by admin users — needs verification against current implementation, since the existence and scope of a settings area was unconfirmed at the time this documentation was written.

## Related Documentation

- `manual-test-cases.md`
- `edge-cases.md`
- `../api/catalog.md`, `../api/orders.md`, `../api/admin.md`
