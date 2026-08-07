# State Management

## Overview

This document describes conventional state management patterns appropriate for the declared stack. The actual state management approach used in the codebase (React Context, a dedicated store library such as Zustand/Redux, and/or TanStack Query for server state) is unconfirmed.

> This should match the project's implementation. The presence of a `src/stores/` directory (referenced in prior instructions) suggests a dedicated client-state store pattern is in use — confirm the actual library and structure directly in the repository.

## Categories of State

### Server State (Data from Supabase)

- Data fetched from Supabase (products, orders, user profile) is "server state" — it originates outside the client and can go stale.
- A dedicated data-fetching/caching layer (e.g., TanStack Query) is the conventional pairing with TanStack Router for this kind of state, providing caching, refetching, and loading/error states. Whether this project uses such a library, or fetches directly via the Supabase client inside route loaders/components, should match the project's implementation.

### Client/UI State

- Local UI state (form inputs, modal open/close, filter selections) is conventionally handled with React's built-in `useState`/`useReducer`.
- Cross-cutting client state (e.g., cart contents, auth session) is conventionally handled via a dedicated store (Context, Zustand, or similar) — this maps to the `src/stores/` directory referenced elsewhere in this documentation set.

## Cart State (Conceptual)

Given the checkout flow described in `../api/orders.md`, cart state is expected to be held client-side until checkout submission, likely including:

- Line items (product ID, quantity)
- Derived totals (subtotal, tax, shipping)

Whether cart state persists across sessions (e.g., via local storage or synced to a Supabase table for authenticated users) should match the project's implementation.

## Auth State

- Auth/session state is conventionally sourced from the Supabase client's session, either read directly where needed or mirrored into a store/context for convenient access across the app (e.g., to conditionally render admin navigation). See `../api/authentication.md`.

## Guidance

- Prefer deriving state over duplicating it (e.g., don't store both `cartTotal` and the line items if `cartTotal` can be computed from line items).
- Keep server state and client state clearly separated to avoid stale-cache bugs, especially for data affected by RLS-scoped Supabase queries.

## Related Documentation

- `Architecture.md`
- `Supabase-Patterns.md`
- `../api/authentication.md`
