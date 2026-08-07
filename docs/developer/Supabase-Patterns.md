# Supabase Patterns

## Overview

Conventional patterns for working with Supabase in this codebase, expanding on `../api/supabase.md` with developer-facing guidance for writing new queries/mutations safely.

> This should match the project's implementation. No actual Supabase client wrapper or query code was inspected — confirm the real patterns used in `src/` before following this guide as gospel.

## Client Usage

- A single Supabase client instance is conventionally created once (e.g., in a `src/lib/supabase.ts`-style module) and imported wherever needed, rather than re-instantiated per component.
- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` or equivalent) should be the only configuration required client-side; the service role key must never be used or shipped in client code.

## Querying Data

- Prefer Supabase's query builder (`.from(table).select(...)`) with explicit column selection over `select('*')` where practical, to keep payloads lean and queries self-documenting.
- Apply filters (`.eq()`, `.in()`, etc.) server-side via the query builder rather than fetching broad data and filtering client-side, both for performance and because RLS is evaluated per-query.

## Writing Data

- Mutations (`.insert()`, `.update()`, `.delete()`) rely on RLS policies for authorization — do not assume a mutation is "safe" just because the UI hides the control from unauthorized users; the policy is the actual enforcement point (see `../qa/security-tests.md`).
- Handle and surface Supabase error responses distinctly from "no data found" — a blocked-by-RLS write and a genuine validation error should ideally produce different user-facing messages, though the exact UX pattern should match the project's implementation.

## Types

- If Supabase-generated TypeScript types (via `supabase gen types typescript`) are in use, keep them regenerated after schema changes so the client code stays in sync with the actual database shape. Confirm whether this generation step is part of the project's workflow.

## Realtime & Edge Functions

- See `../api/supabase.md` for whether Realtime subscriptions or Edge Functions are part of the actual implementation; if adopted, document specific usage patterns here as they're confirmed.

## Related Documentation

- `../api/supabase.md`
- `../api/database-overview.md`
- `State-Management.md`
