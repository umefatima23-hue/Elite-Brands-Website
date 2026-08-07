# Technical Debt

## Overview

A tracking document for known or suspected technical debt. Since this documentation set was produced without direct code access, most items here are framed as things to verify rather than confirmed debt.

> Each item below should be confirmed against the actual codebase and either promoted to a tracked issue or removed if not applicable. This should match the project's implementation.

## Areas to Verify

### Environments

- Confirm whether staging/preview deployments use an isolated Supabase project or share the production database. Sharing would be a debt item worth prioritizing (see `../operations/deployment-guide.md`).

### Test Coverage

- Confirm whether automated tests exist for critical flows (checkout, admin CRUD, auth) or whether coverage relies solely on manual QA (`../qa/`). Given the active `feature/mobile1-admin-ui` branch, admin UI test coverage is a reasonable area to prioritize.

### Authorization Model

- Confirm the exact mechanism distinguishing admin vs. customer roles (custom claim, `profiles.role` column, separate table). An ad hoc or inconsistently enforced role check across client guards and RLS policies is a common source of security debt — see `../qa/security-tests.md`.

### Documentation Drift

- This documentation set (`docs/`) was written without reading the actual source. As the implementation is confirmed, replace "This should match the project's implementation" placeholders with verified detail to avoid the docs drifting from reality.

### Dependency Freshness

- No dependency audit was performed as part of producing this documentation. See `../operations/maintenance.md` for ongoing dependency hygiene.

## Related Documentation

- `../operations/maintenance.md`
- `../qa/security-tests.md`
- `future-features.md`
