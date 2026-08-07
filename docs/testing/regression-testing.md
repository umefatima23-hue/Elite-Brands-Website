# Regression Testing Guide

## Overview

A checklist-style guide for regression passes prior to release, covering the critical paths across the storefront and admin surfaces. Intended to be run before merging significant feature branches (e.g., `feature/mobile1-admin-ui`) into a release branch, and before production deploys.

> This should match the project's implementation for any automated test suite that may cover parts of this checklist already (unit/integration/e2e tests under `src/` or a dedicated test directory).

## Core Regression Checklist

### Storefront

- [ ] Home page loads without console errors
- [ ] Catalog browsing, filtering, and search all function (see `catalog-testing.md`, `search-testing.md`)
- [ ] Product detail pages render correctly for a sample of products
- [ ] Add-to-cart and cart management work end-to-end
- [ ] Checkout completes successfully for a test order (see `checkout-testing.md`)

### Authentication

- [ ] Sign-up, login, logout all function (see `authentication-testing.md`)
- [ ] Protected routes correctly gate access

### Admin

- [ ] Admin login and role gating function (see `admin-testing.md`)
- [ ] Product/brand/category CRUD function
- [ ] Order management functions
- [ ] Mobile admin layout renders correctly at common breakpoints

### Cross-Cutting

- [ ] No broken links/routes across primary navigation
- [ ] No new console errors/warnings introduced
- [ ] Build (`bun run build` or equivalent) completes without errors
- [ ] No unintended visual regressions in shared UI (shadcn/ui components, Tailwind theming)

## Suggested Cadence

- Run before every merge to a release/production branch.
- Run after any dependency upgrade (React, Vite, TanStack Router, Supabase client, Tailwind).

## Related Documentation

- `admin-testing.md`
- `checkout-testing.md`
- `catalog-testing.md`
- `authentication-testing.md`
- `../operations/release-process.md`
