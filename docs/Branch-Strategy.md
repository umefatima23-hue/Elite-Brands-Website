# Branch Strategy

## Overview

A conventional branch strategy for this repository, inferred from the observed branch naming pattern (`feature/mobile1-admin-ui`).

> This should match the project's implementation. The team's actual branch protection rules and merge policy should be confirmed in the repository's Settings, which were not accessible when producing this document.

## Branch Types

| Branch | Purpose |
|---|---|
| `main` (or `production`) | Deployable, production branch. Should always be in a releasable state. |
| `feature/<short-description>` | New feature work, e.g. `feature/mobile1-admin-ui` |
| `fix/<short-description>` | Bug fixes not tied to a specific feature branch |
| `docs/<short-description>` | Documentation-only changes, e.g. `docs/developer-guides` |
| `chore/<short-description>` | Tooling, dependency, or config changes |

If the team uses an intermediate `develop`/`staging` branch between feature branches and `main`, confirm and document its role here.

## Naming Convention

- Lowercase, hyphen-separated description after the type prefix: `feature/admin-order-filters`, not `feature/AdminOrderFilters`.
- Keep names short but descriptive enough to identify the work without opening the branch.

## Branch Lifecycle

1. Branch from the latest `main` (or `develop`, if used).
2. Work and commit per `Git-Workflow.md`.
3. Open a pull request targeting the base branch.
4. After review and approval, merge and delete the feature branch.

## Long-Lived Feature Branches

For larger efforts like `feature/mobile1-admin-ui` that may span multiple PRs or a longer timeline:

- Regularly sync with `main` to avoid large, conflict-prone merges at the end.
- Consider breaking the work into smaller, independently mergeable PRs behind the same feature branch where possible, to reduce review burden and risk.

## Protected Branches

`main` (and any release/staging branch) should be protected against direct pushes, requiring pull requests and passing checks before merge. Confirm actual branch protection settings in the repository.

## Related Documentation

- `Git-Workflow.md`
- `Versioning-Guide.md`
- `operations/release-process.md`
