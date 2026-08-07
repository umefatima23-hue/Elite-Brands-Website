# Performance Testing Guide

## Overview

Guidance for evaluating the performance of the storefront and admin experiences, given a React + Vite + TanStack Router + Supabase stack deployed on Vercel.

> This should match the project's implementation for any existing performance budgets, monitoring tools, or CI performance gates already configured.

## Areas to Test

### Page Load

- [ ] Initial load time (Largest Contentful Paint) for the home page and catalog page, on both desktop and mobile network conditions
- [ ] Time to Interactive for pages with client-side data fetching (catalog, admin dashboard)
- [ ] Bundle size review after significant dependency additions (Vite build output analysis)

### Data Fetching

- [ ] Catalog listing query performance at representative product counts
- [ ] Search query response time (see `search-testing.md`)
- [ ] Admin dashboard aggregate/analytics queries do not block UI rendering (loading states present)

### Images

- [ ] Product images are appropriately sized/optimized before/at delivery
- [ ] Image loading does not block critical rendering (lazy loading where appropriate)

### Mobile Admin

- [ ] Admin UI remains responsive on lower-end mobile devices/network conditions, given the mobile-first admin work in progress

## Suggested Tools

- Browser DevTools (Lighthouse, Performance panel)
- Vercel Analytics/Speed Insights, if enabled — confirm against project's Vercel configuration
- Vite build analyzer for bundle size regressions

This should match the project's implementation for which of these tools are actually integrated.

## Related Documentation

- `search-testing.md`
- `../operations/monitoring.md`
- `../roadmap/scaling-plan.md`
