# Admin Guide: Analytics

## Overview

The analytics view is expected to surface summary business metrics for administrators, drawing on the orders and catalog data described in `../api/orders.md` and `../api/catalog.md`.

> This should match the project's implementation for exact metrics displayed and time-range filtering options.

## Expected Metrics

- Total orders and revenue over a selected period
- Best-selling products/brands
- Low-stock or out-of-stock product counts
- New customer sign-ups over a selected period

## Data Freshness

Whether analytics are computed in real time from live tables or from a periodically refreshed aggregate/materialized view should match the project's implementation; this has implications for dashboard load performance (see `../testing/performance-testing.md`).

## Related Documentation

- `dashboard.md`
- `../api/orders.md`
- `../operations/monitoring.md`
