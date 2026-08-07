# Admin Testing Guide

## Overview

Test scenarios for the admin interface, covering the admin dashboard, product/brand/category management, and order management surfaces. This applies primarily to work on the `feature/mobile1-admin-ui` branch and related admin functionality.

> This should match the project's implementation for exact UI element selectors, routes, and validation rules.

## Scope

- Admin authentication and role-gated access
- Product CRUD via the admin UI
- Brand and category CRUD via the admin UI
- Order status management
- Customer visibility (read-only)
- Analytics view
- Settings area (if implemented)
- Mobile-responsive admin layout behavior

## Test Scenarios

### Access Control

- [ ] Non-authenticated user is redirected away from `/admin` routes
- [ ] Authenticated non-admin user is denied access to `/admin` routes
- [ ] Authenticated admin user can access `/admin` routes
- [ ] Admin session expiry mid-session redirects to login

### Product Management

- [ ] Admin can create a new product with all required fields
- [ ] Admin cannot submit a product form with missing required fields (validation surfaces correctly)
- [ ] Admin can edit an existing product and changes persist
- [ ] Admin can delete a product, and it no longer appears in the storefront catalog
- [ ] Product image upload succeeds and image renders in both admin and storefront views

### Brand & Category Management

- [ ] Admin can create/edit/delete brands
- [ ] Admin can create/edit/delete categories
- [ ] Deleting a brand/category in use by products behaves as expected (blocked, cascaded, or nullified — confirm expected behavior against implementation)

### Order Management

- [ ] Admin can view a list of all orders
- [ ] Admin can filter/search orders (by status, customer, date)
- [ ] Admin can update an order's status
- [ ] Order status changes are reflected in the customer-facing order history

### Customer Visibility

- [ ] Admin can view a list of registered customers
- [ ] Admin can view a customer's order history from their profile
- [ ] Sensitive account fields (password, auth internals) are not exposed in the admin customer view — needs verification against current implementation

### Analytics

- [ ] Admin analytics view loads without error and displays summary metrics
- [ ] Metrics reflect actual order/catalog data (spot-check against a known test order) — needs verification against current implementation for exact metrics shown
- [ ] Analytics view degrades gracefully (loading/empty state) when there is no data yet

### Settings

- [ ] Admin can access the settings area, if implemented — needs verification against current implementation, since the existence and scope of a settings area was unconfirmed at the time this documentation was written (see `../admin-guide/settings.md`)
- [ ] Non-admin users cannot access settings

### Mobile Admin UI (`feature/mobile1-admin-ui`)

- [ ] Admin dashboard renders correctly at mobile viewport widths
- [ ] Navigation/menu is usable on small screens (e.g., collapses to a drawer/hamburger pattern)
- [ ] Tables/lists that don't fit mobile width degrade gracefully (horizontal scroll, card layout, etc.)
- [ ] Forms are usable with mobile keyboards/input types

## Related Documentation

- `../api/admin.md`
- `../qa/acceptance-criteria.md`
- `../admin-guide/dashboard.md`
