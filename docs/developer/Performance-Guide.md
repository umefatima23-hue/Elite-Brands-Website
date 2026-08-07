# Performance Guide

## Overview

Developer-facing guidance for keeping the application performant, complementing the QA-focused `../testing/performance-testing.md`.

> This should match the project's implementation. No bundle analysis or profiling was performed to produce this document.

## Bundle Size

- Vite's production build is the source of truth for bundle size; review the build output periodically (or use a bundle analyzer plugin, if configured) after adding new dependencies.
- Consider route-based code splitting for the admin surface, so storefront visitors never download admin-only code (React.lazy / TanStack Router's built-in code-splitting support, if used — should match the project's implementation).
- Prefer named imports from libraries that support tree-shaking (e.g., `lucide-react` icons imported individually) over broad namespace imports.

## Data Fetching

- Avoid over-fetching from Supabase — select only needed columns, and paginate list views (catalog, orders, admin lists) rather than loading full tables.
- Cache/reuse query results where appropriate (see `State-Management.md`) to avoid redundant network round-trips on navigation.

## Images

- Serve appropriately sized images from Supabase Storage; avoid shipping full-resolution originals to every viewport. See `../api/storage.md` for whether image transformation/optimization is in place.
- Use native lazy loading (`loading="lazy"`) for below-the-fold product images where applicable.

## Rendering

- Avoid unnecessary re-renders in list-heavy views (catalog grid, admin tables) — memoize list item components where profiling shows a benefit; avoid premature optimization without measurement.
- Keep Tailwind class lists static where possible (avoid excessive dynamic class string construction) for predictable styling and easier debugging.

## Measuring

- Use browser DevTools Lighthouse/Performance panels and, if enabled, Vercel Speed Insights, to validate changes against the checklist in `../testing/performance-testing.md` rather than optimizing blindly.

## Related Documentation

- `../testing/performance-testing.md`
- `../roadmap/scaling-plan.md`
- `State-Management.md`
