# Smoke Tests

## Overview

A minimal set of checks to run immediately after a deploy to confirm the application is fundamentally functional before proceeding with a fuller regression pass.

## Checklist

- [ ] Home page loads without errors
- [ ] Catalog page loads and displays at least one product
- [ ] Product detail page loads for a known product
- [ ] Login page loads and a known test account can sign in
- [ ] Cart page loads (empty or with items)
- [ ] Admin login succeeds for a known admin test account
- [ ] Admin dashboard loads without errors
- [ ] No obvious console errors on any of the above pages
- [ ] Supabase connectivity is healthy (data-backed pages return data, not error states)

## When to Run

- Immediately after every production deploy
- Immediately after every preview deploy intended for stakeholder review
- After any Supabase schema migration

## Related Documentation

- `../testing/regression-testing.md`
- `../operations/deployment-guide.md`
- `../operations/monitoring.md`
