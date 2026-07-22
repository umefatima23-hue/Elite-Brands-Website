# Routes — Elite Brands

File-based routing via TanStack Router. Filenames map to URLs (dots → slashes).
`routeTree.gen.ts` is auto-generated; never hand-edit.

## Current map (Sprint 01 foundation)

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `shop.tsx` | `/shop` |
| `brands.tsx` | `/brands` |
| `collections.tsx` | `/collections` |
| `outlet.tsx` | `/outlet` |
| `deals.tsx` | `/deals` |
| `product.$slug.tsx` | `/product/:slug` |
| `cart.tsx` | `/cart` |
| `checkout.tsx` | `/checkout` |
| `wishlist.tsx` | `/wishlist` |
| `account.tsx` | `/account` |
| `about.tsx` | `/about` |
| `contact.tsx` | `/contact` |
| `policies.$slug.tsx` | `/policies/:slug` (privacy, terms, shipping, returns) |
| `auth.$mode.tsx` | `/auth/:mode` (login, register, reset) |
| `maintenance.tsx` | `/maintenance` |
| `sitemap[.]xml.ts` | `/sitemap.xml` |

## Conventions

- Every page wraps its body in `<AppShell>` so the global chrome (announcement bar, header, footer, floats) renders consistently.
- Metadata is built via `buildMeta()` from `@/lib/seo` — keeps title / OG / Twitter tags coherent across the site.
- Canonical links go on leaf routes only, via `canonical()`.
- Private routes (`/cart`, `/checkout`, `/wishlist`, `/account`, `/auth/*`) emit `noindex`.
