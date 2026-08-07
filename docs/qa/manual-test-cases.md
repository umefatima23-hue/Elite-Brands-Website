# Manual Test Cases

## Overview

A structured set of manual test cases for QA passes across the storefront and admin surfaces. Each case lists preconditions, steps, and expected results. Actual UI copy/selectors should match the project's implementation.

## TC-001: Browse Catalog

- **Preconditions:** Catalog contains at least one product.
- **Steps:** Navigate to the catalog page.
- **Expected Result:** Products are listed with name, price, and thumbnail image.

## TC-002: Filter by Brand

- **Preconditions:** At least two brands exist with products.
- **Steps:** Select a brand filter.
- **Expected Result:** Only products from the selected brand are shown.

## TC-003: Add Product to Cart

- **Preconditions:** A product is in stock.
- **Steps:** Open product detail; click "Add to Cart."
- **Expected Result:** Cart count increments; product appears in cart with correct quantity/price.

## TC-004: Complete Checkout

- **Preconditions:** Cart has at least one item; user is authenticated.
- **Steps:** Proceed to checkout; fill required fields; submit payment.
- **Expected Result:** Order is created; confirmation is displayed; order appears in order history.

## TC-005: Register New Account

- **Preconditions:** Email not already registered.
- **Steps:** Complete sign-up form with valid data.
- **Expected Result:** Account created; user is authenticated (or directed to verify email).

## TC-006: Admin Login

- **Preconditions:** An admin account exists.
- **Steps:** Log in with admin credentials; navigate to `/admin`.
- **Expected Result:** Admin dashboard loads successfully.

## TC-007: Admin Creates Product

- **Preconditions:** Logged in as admin.
- **Steps:** Navigate to product creation form; fill required fields; submit.
- **Expected Result:** Product is created and visible in both admin list and storefront catalog.

## TC-008: Admin Updates Order Status

- **Preconditions:** At least one order exists; logged in as admin.
- **Steps:** Open order in admin; change status; save.
- **Expected Result:** Order status updates in admin view and customer order history.

## TC-009: Non-Admin Blocked from Admin Routes

- **Preconditions:** Logged in as a non-admin user.
- **Steps:** Navigate directly to `/admin`.
- **Expected Result:** Access is denied/redirected.

## TC-010: Search for Product

- **Preconditions:** Catalog contains a product with a known name.
- **Steps:** Enter the product name (or partial name) into search.
- **Expected Result:** The product appears in results.

## Related Documentation

- `acceptance-criteria.md`
- `edge-cases.md`
- `smoke-tests.md`
