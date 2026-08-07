# Maintenance Guide

## Overview

Routine maintenance tasks to keep the application, dependencies, and Supabase backend healthy over time.

> This should match the project's implementation for any maintenance automation (dependency bots, scheduled jobs) already in place.

## Dependency Maintenance

- Periodically review and update dependencies (React, Vite, TanStack Router, Supabase JS client, TailwindCSS, shadcn/ui components).
- Prioritize security patches; test thoroughly after major version bumps given the tight coupling between Vite, React, and TanStack Router versions.
- Re-run `../testing/regression-testing.md` after any significant dependency upgrade.

## Database Maintenance

- Review Supabase database performance periodically (slow query logs, index usage) as catalog/order volume grows.
- Clean up orphaned data if any soft-delete or draft patterns leave stale rows (confirm whether this pattern exists — should match the project's implementation).
- Review and prune unused Storage objects (e.g., images for deleted products) if not automatically cascaded.

## Content Maintenance

- Periodically audit product/brand/category data for accuracy (broken image links, stale pricing) via the admin UI.

## Housekeeping

- Review and rotate any long-lived credentials/API keys periodically, per whatever schedule the team adopts.
- Keep this documentation set (`docs/`) updated as the actual implementation is confirmed or changes, replacing "This should match the project's implementation" placeholders with verified detail.

## Related Documentation

- `monitoring.md`
- `../roadmap/technical-debt.md`
