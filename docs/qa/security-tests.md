# Security Tests

## Overview

Security-focused test scenarios for authentication, authorization, and data access, given the Supabase-backed architecture where much of the authorization logic lives in Row Level Security policies rather than a traditional server-side API.

> This should match the project's implementation. Actual RLS policies and route guards must be reviewed directly to confirm these protections are in place — this document describes what to test for, not confirmation that it is implemented.

## Authentication

- [ ] Passwords are never logged or exposed in client-side error messages
- [ ] Session tokens are not exposed in URLs
- [ ] Logout fully invalidates the local session (no stale access after logout)

## Authorization (Row Level Security)

- [ ] A regular authenticated user cannot read another user's orders via direct Supabase queries (not just via UI restriction)
- [ ] A regular authenticated user cannot write/update another user's orders
- [ ] A non-admin user cannot perform admin-only mutations (product/brand/category writes) even if they call the underlying Supabase client directly with a valid but non-admin session
- [ ] Anonymous (unauthenticated) users can read public catalog data but cannot read orders or customer data
- [ ] Anonymous users cannot write to any table (products, orders, etc.)

## Admin Route Protection

- [ ] Direct navigation to admin routes without a session redirects to login
- [ ] Direct navigation to admin routes with a non-admin session is denied, not just visually hidden
- [ ] Admin-only API/RPC calls reject non-admin callers even if the request is crafted manually (e.g., via browser dev tools or a REST client)

## Input Validation

- [ ] Form inputs (checkout, product creation) are validated both client-side and, ideally, at the database/RLS or Edge Function layer
- [ ] File uploads (product images) reject unexpected file types/sizes

## Secrets & Configuration

- [ ] No Supabase service role key or other privileged secret is present in client-side bundles (only the public anon key should ship to the browser)
- [ ] Environment variables containing secrets are configured at the Vercel project level, not committed to the repository

## Related Documentation

- `../api/authentication.md`
- `../api/supabase.md`
- `edge-cases.md`
