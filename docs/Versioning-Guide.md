# Versioning Guide

## Overview

Guidance for versioning releases of the Elite Brands Website, given no confirmed existing versioning scheme.

> This should match the project's implementation. Whether the project currently applies any version numbers (in `package.json`, Git tags, or elsewhere) was not confirmed — this document proposes a convention if none exists yet.

## Suggested Scheme: Semantic Versioning

If adopting a version number (e.g., in `package.json`'s `version` field and as Git tags), Semantic Versioning (`MAJOR.MINOR.PATCH`) is a reasonable default for a web application:

- **MAJOR** — breaking changes to data model or significant user-facing redesign
- **MINOR** — new features, backward compatible (e.g., new admin capabilities, new storefront features)
- **PATCH** — bug fixes, minor tweaks, documentation-only changes

## Tagging Releases

If adopted:

```bash
git tag -a v1.2.0 -m "Release 1.2.0: mobile admin UI"
git push origin v1.2.0
```

## Alternative: Continuous Deployment Without Formal Versioning

Many Vercel-deployed SPAs skip formal semantic versioning entirely and rely on:

- Vercel's deployment history (each deploy is inherently addressable/rollback-able) — see `../operations/rollback-guide.md`
- Git commit SHAs as the de facto version reference

If this is the project's actual current practice, this document should be updated to reflect that instead of prescribing semantic versioning. **This should match the project's implementation.**

## Database Schema Versioning

Independent of application versioning, Supabase schema changes should be tracked via sequential migration files (see `developer/Supabase-Patterns.md` and `../api/database-overview.md`), which serve as the effective "version history" of the database schema regardless of whether the application itself is formally versioned.

## Related Documentation

- `Git-Workflow.md`
- `Branch-Strategy.md`
- `../operations/release-process.md`
- `../operations/rollback-guide.md`
