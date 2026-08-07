# TanStack Router

## Overview

Conventional usage guidance for TanStack Router in this codebase, given the presence of `routeTree.gen.ts` in the project root.

> This should match the project's implementation. No actual route definitions were inspected — confirm the real routing structure directly in `src/routes/` (or equivalent) before relying on this document.

## Route Tree Generation

- `routeTree.gen.ts` is an auto-generated file produced by the TanStack Router Vite plugin (or CLI) from the route files under the project's routes directory.
- **Never hand-edit `routeTree.gen.ts`.** It should be regenerated automatically on dev server start / build, based on the actual route file structure.
- If the generated file appears out of sync with route files, restart the dev server or re-run the router's codegen step rather than editing the generated output directly.

## Route Organization (Conventional)

TanStack Router's file-based routing convention typically maps file paths to URL paths, e.g.:

```
routes/
  index.tsx            -> /
  products.index.tsx    -> /products
  products.$productId.tsx -> /products/:productId
  admin/
    index.tsx           -> /admin
    products.tsx         -> /admin/products
    orders.tsx            -> /admin/orders
```

Actual file names and nesting should match the project's implementation.

## Route Guards (Auth/Admin)

- Protected routes (customer account pages, all `/admin/*` routes) are conventionally guarded via a `beforeLoad` function that checks Supabase session/role state and redirects unauthenticated or unauthorized users. See `../api/authentication.md` for the expected authorization model.
- Keep guard logic centralized (e.g., a shared `requireAuth`/`requireAdmin` helper) rather than duplicated per route, to avoid drift between routes.

## Data Loading

- TanStack Router supports route `loader` functions for fetching data before a route renders. Whether this project uses route loaders directly against Supabase, or fetches data inside components (possibly via TanStack Query), should match the project's implementation — see `State-Management.md`.

## Related Documentation

- `Architecture.md`
- `Folder-Structure.md`
- `../api/authentication.md`
