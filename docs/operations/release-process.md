# Release Process

## Overview

A conventional release process for merging feature work (such as `feature/mobile1-admin-ui`) into production, given the branch-based workflow implied by the project's structure.

> This should match the project's implementation for the team's actual branching strategy, code review requirements, and CI configuration.

## Branching Convention (Assumed)

- `main` (or `production`) — deployable production branch
- `feature/*` — in-progress feature branches, e.g. `feature/mobile1-admin-ui`
- Pull requests merge feature branches into `main` (or an intermediate `develop`/`staging` branch, if used)

For the full branch naming/lifecycle convention, treat `../Branch-Strategy.md` as canonical — the summary above exists only for release-process context and should not be updated independently of that document.

## Release Checklist

1. **Feature complete** — all intended changes for the release are merged into the release branch.
2. **Code review** — pull request(s) reviewed and approved per team convention.
3. **Regression pass** — run through `../testing/regression-testing.md`.
4. **Database migrations** — confirm any new Supabase migrations are ready to apply, and apply them to the target environment ahead of or alongside the code deploy.
5. **Deploy** — follow `deployment-guide.md`.
6. **Smoke test** — run `../qa/smoke-tests.md` against the freshly deployed environment.
7. **Announce** — notify relevant stakeholders that the release is live, noting any user-facing changes.

## Versioning

Whether the project follows semantic versioning, date-based versioning, or no formal versioning scheme is unconfirmed. This should match the project's implementation.

## Related Documentation

- `deployment-guide.md`
- `rollback-guide.md`
- `../testing/regression-testing.md`
- `../Branch-Strategy.md` — canonical branch naming/lifecycle reference
- `../Git-Workflow.md` — day-to-day Git process
