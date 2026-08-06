# Release Process

## Branching Model
- `main` (or `production`) — always deployable, maps to production
- Feature/fix branches — merged via PR after review

## Standard Release Flow
1. **Develop** on a feature branch; commit small, reviewable changes.
2. **Open a PR** into the release branch.
3. **Automated checks** (if CI is configured) must pass: lint, build, type-check.
4. **Preview deployment**: Vercel auto-generates a preview URL per PR — test against it directly.
5. **QA pass**: run through `QA_CHECKLIST.md` on the preview URL.
6. **Merge**: squash or merge per team convention; this triggers production deployment on Vercel.
7. **Post-deploy verification**: run through the checklist in `DEPLOYMENT_GUIDE.md`.
8. **Tag the release** (optional but recommended): `git tag vX.Y.Z && git push --tags` for traceability.

## Versioning
Use semantic versioning where practical:
- **Major**: breaking changes to data model or user-facing flows
- **Minor**: new features, backward-compatible
- **Patch**: bug fixes, no new functionality

## Database Migrations
- Migrations go through Supabase CLI/migration files, applied to staging first, then production.
- Never apply an untested migration directly to production.
- Take a manual backup immediately before any production migration (`BACKUP_RECOVERY.md`).

## Release Checklist
- [ ] All PR checks passed
- [ ] Preview deployment tested against `QA_CHECKLIST.md`
- [ ] `SECURITY_CHECKLIST.md` reviewed if the release touches auth/data access
- [ ] Database migration (if any) tested on staging
- [ ] Rollback plan confirmed (previous good deployment identified)
- [ ] Stakeholders notified for any release with user-visible changes

## Hotfix Process (urgent production fix)
1. Branch directly from `main`/`production`.
2. Make the minimal necessary change.
3. Fast-track review (still requires at least one review where possible).
4. Deploy and verify immediately.
5. Backport the fix to any active feature branches to avoid regression.
6. Log the hotfix in the incident log if it was in response to an incident (`INCIDENT_RESPONSE.md`).
