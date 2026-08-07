# Admin Dashboard Guide

## Overview

The admin dashboard is the landing view for administrators after logging in, expected to summarize key store activity at a glance (recent orders, low-stock alerts, quick links to management areas).

> This should match the project's implementation for the actual widgets/metrics shown on the dashboard.

## Expected Contents

- Summary cards (e.g., total orders today, pending orders, revenue snapshot)
- Recent orders list with quick links to order detail
- Low-stock or out-of-stock product alerts
- Navigation to Orders, Products, Brands, Categories, Customers, Analytics, and Settings

## Mobile Layout

Given the active `feature/mobile1-admin-ui` work, the dashboard is expected to reflow into a single-column, touch-friendly layout on small screens, with summary cards stacking vertically and navigation collapsing into a drawer or bottom navigation pattern.

This should match the project's implementation — confirm the actual responsive breakpoints and navigation pattern used.

## Related Documentation

- `../api/admin.md`
- `orders.md`
- `analytics.md`
- `../testing/admin-testing.md`
