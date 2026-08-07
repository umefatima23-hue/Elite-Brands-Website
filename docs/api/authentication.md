# Authentication

## Overview

Authentication for the Elite Brands Website is expected to be handled by **Supabase Auth**, given the declared stack. This document describes the conventional Supabase Auth integration pattern for a React + Vite + TanStack Router application and should be reconciled against the actual implementation in `src/`.

> This should match the project's implementation. No auth provider configuration, session handling code, or route guards were inspected to produce this document.

## Identity Provider

- **Provider:** Supabase Auth
- **Expected methods:** Email/password, and optionally OAuth providers (Google, etc.) — this should match the project's implementation.
- **Session storage:** Supabase client persists session tokens (access + refresh) client-side, typically in local storage or cookies depending on client configuration.

## Session Lifecycle

1. User submits credentials (or completes an OAuth flow).
2. Supabase Auth issues a JWT access token and refresh token.
3. The Supabase JS client stores the session and attaches the access token to subsequent requests (including PostgREST calls used for RLS-scoped data access).
4. Token refresh is handled automatically by the Supabase client library prior to expiry.

## Roles: Customer vs. Admin

Two logical roles are expected:

- **Customer** — can browse the catalog, manage their own cart/orders, and view their own order history.
- **Admin** — can additionally access `/admin` routes and the Admin API surface described in `admin.md`.

The mechanism distinguishing a customer from an admin (custom JWT claim, a `role` column on a `profiles` table, or a separate `admin_users` table) should match the project's implementation.

## Route Protection

With TanStack Router, protected routes are conventionally implemented via a route-level `beforeLoad` (or equivalent) guard that:

1. Checks for an active Supabase session.
2. Redirects unauthenticated users to a login route.
3. For admin routes, additionally verifies the admin role/claim and redirects unauthorized users (e.g., to a 403 page or the storefront home).

This should match the project's implementation — confirm the actual guard pattern used in the router configuration.

## Row Level Security Alignment

Because Supabase enforces authorization primarily at the database layer via RLS, authentication state (the JWT `auth.uid()`) is the basis for most access control, rather than solely server-side route middleware. See `supabase.md` for RLS conventions.

## Error Handling

| Scenario | Expected Behavior |
|---|---|
| Invalid credentials | Auth error surfaced to the login form |
| Expired session on protected route | Redirect to login, optionally preserving intended destination |
| Non-admin accessing `/admin` | Redirect or 403 page |

## Related Documentation

- `supabase.md` — Supabase client configuration and RLS
- `admin.md` — admin-only API surface gated by role
- `../qa/security-tests.md` — authentication/authorization test scenarios
