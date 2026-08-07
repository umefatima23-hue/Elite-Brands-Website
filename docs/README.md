# Elite Brands Website — Documentation Index

This is the navigation hub for all project documentation. Start here.

> **A note on how this documentation was produced:** this `docs/` set was written without direct access to the application source code (`src/`, `public/`, `supabase/`, config files). Every file that makes a claim about actual implementation details — routes, schema, scripts, folder contents — flags that claim with **"This should match the project's implementation"** where it has not been verified against the real codebase. Treat this documentation as a scaffold to be verified and corrected by someone with repository access, not as a confirmed source of truth. See `roadmap/technical-debt.md` for more on this.

## Start Here

- **[Developer Onboarding Guide](Developer-Onboarding.md)** — set up your local environment
- **[Architecture](developer/Architecture.md)** — system overview
- **[Folder Structure](developer/Folder-Structure.md)** — where things live

## Contributing

- [Contributing Guide](developer/Contributing.md)
- [Git Workflow](Git-Workflow.md)
- [Branch Strategy](Branch-Strategy.md)
- [Coding Standards](developer/Coding-Standards.md)
- [Versioning Guide](Versioning-Guide.md)

## API Documentation (`api/`)

- [Catalog API](api/catalog.md)
- [Orders API](api/orders.md)
- [Admin API](api/admin.md)
- [Authentication](api/authentication.md)
- [Database Architecture Overview](api/database-overview.md)
- [Supabase Integration](api/supabase.md)
- [Storage Architecture](api/storage.md)

## Developer Guides (`developer/`)

- [Architecture](developer/Architecture.md)
- [Folder Structure](developer/Folder-Structure.md)
- [Coding Standards](developer/Coding-Standards.md)
- [State Management](developer/State-Management.md)
- [Supabase Patterns](developer/Supabase-Patterns.md)
- [TanStack Router](developer/TanStack-Router.md)
- [Deployment Pipeline](developer/Deployment-Pipeline.md)
- [Performance Guide](developer/Performance-Guide.md)
- [Contributing](developer/Contributing.md)

## Testing (`testing/`)

- [Admin Testing](testing/admin-testing.md)
- [Checkout Testing](testing/checkout-testing.md)
- [Catalog Testing](testing/catalog-testing.md)
- [Authentication Testing](testing/authentication-testing.md)
- [Search Testing](testing/search-testing.md)
- [Inventory Testing](testing/inventory-testing.md)
- [Regression Testing](testing/regression-testing.md)
- [Performance Testing](testing/performance-testing.md)

## QA (`qa/`)

- [Acceptance Criteria](qa/acceptance-criteria.md)
- [Manual Test Cases](qa/manual-test-cases.md)
- [Edge Cases](qa/edge-cases.md)
- [Smoke Tests](qa/smoke-tests.md)
- [Security Tests](qa/security-tests.md)

## Operations (`operations/`)

- [Deployment Guide](operations/deployment-guide.md)
- [Release Process](operations/release-process.md)
- [Rollback Guide](operations/rollback-guide.md)
- [Backup Strategy](operations/backup-strategy.md)
- [Maintenance](operations/maintenance.md)
- [Monitoring](operations/monitoring.md)
- [Incident Response](operations/incident-response.md)

## Roadmap (`roadmap/`)

- [Phase 2](roadmap/phase-2.md)
- [Phase 3](roadmap/phase-3.md)
- [Future Features](roadmap/future-features.md)
- [Technical Debt](roadmap/technical-debt.md)
- [Scaling Plan](roadmap/scaling-plan.md)

## Admin Guide (`admin-guide/`)

- [Dashboard](admin-guide/dashboard.md)
- [Orders](admin-guide/orders.md)
- [Products](admin-guide/products.md)
- [Brands](admin-guide/brands.md)
- [Categories](admin-guide/categories.md)
- [Customers](admin-guide/customers.md)
- [Analytics](admin-guide/analytics.md)
- [Settings](admin-guide/settings.md)

## Repository README

- [README Improvements (proposed)](README-Improvements.md) — a suggested structure for the repository's top-level `README.md`, which was not read or modified in producing this documentation set.

## Documentation Conventions

- Every file that describes an unverified implementation detail is explicitly marked **"This should match the project's implementation."** Do not remove that marking without confirming the detail against the actual code first.
- Cross-references between docs use relative paths from each file's own location. Paths from files at the `docs/` root (like this one) do not use a leading `../`; paths from files in a subfolder (e.g., `developer/`, `api/`) use `../` to return to `docs/` before descending into another subfolder.
- If you find a stale link, an outdated claim, or duplicated guidance while reading, please fix it in the same PR rather than letting it drift further — see `developer/Contributing.md`.

## Related Documentation

- `roadmap/technical-debt.md` — tracks known documentation-drift risk
- `developer/Contributing.md`
