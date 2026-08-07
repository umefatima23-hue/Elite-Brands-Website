# Admin Testing Guide

## Overview

Test scenarios for the admin interface, covering the admin dashboard, product/brand/category management, and order management surfaces. This applies primarily to work on the `feature/mobile1-admin-ui` branch and related admin functionality.

> This should match the project's implementation for exact UI element selectors, routes, and validation rules.

## Scope

- Admin authentication and role-gated access
- Product CRUD via the admin UI
- Brand and category CRUD via the admin UI
- Order status management
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

### Mobile Admin UI (`feature/mobile1-admin-ui`)

- [ ] Admin dashboard renders correctly at mobile viewport widths
- [ ] Navigation/menu is usable on small screens (e.g., collapses to a drawer/hamburger pattern)
- [ ] Tables/lists that don't fit mobile width degrade gracefully (horizontal scroll, card layout, etc.)
- [ ] Forms are usable with mobile keyboards/input types

## Related Documentation

- `../api/admin.md`
- `../qa/acceptance-criteria.md`
- `../admin-guide/dashboard.md`
