# Phase 2 Roadmap

## Overview

This document outlines candidate Phase 2 initiatives for the Elite Brands Website, building on the current catalog/orders/admin foundation described in `docs/api/`.

> These are planning placeholders, not commitments. Actual prioritization should match the project's roadmap as defined by the team/product owner.

## Candidate Initiatives

### Mobile Admin UI Completion

- Continue and stabilize the work started on `feature/mobile1-admin-ui`.
- Extend mobile-responsive treatment across all admin views (see `../admin-guide/`).

### Enhanced Search

- Evaluate moving from basic filtering to a more robust search experience (full-text search tuning, typo tolerance).
- See `../testing/search-testing.md` for the testing surface this would expand.

### Order Fulfillment Improvements

- Expand order status tracking (e.g., shipping carrier integration, tracking numbers).
- See `../api/orders.md` for the current conceptual order lifecycle this would extend.

### Customer Accounts

- Order history enhancements (reordering, saved addresses).
- Wishlist/favorites, if prioritized.

## Out of Scope for Phase 2

- Multi-currency/internationalization (tracked as a possible Phase 3 item, see `phase-3.md`).

## Related Documentation

- `phase-3.md`
- `future-features.md`
- `technical-debt.md`
