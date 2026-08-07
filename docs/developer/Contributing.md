# Contributing

## Overview

Guidance for contributing to the Elite Brands Website codebase. This document assumes the conventions described elsewhere in `docs/developer/` and should be read alongside `../Git-Workflow.md` and `../Branch-Strategy.md`.

> This should match the project's implementation. Actual PR templates, required checks, or CODEOWNERS rules were not inspected — confirm against the repository's `.github/` configuration, if present.

## Before You Start

1. Read `Architecture.md` and `Folder-Structure.md` to orient yourself.
2. Set up your local environment per `../Developer-Onboarding.md`.
3. Confirm which branch to base your work on per `../Branch-Strategy.md`.

## Making Changes

- Follow `Coding-Standards.md` for style and structure.
- Keep changes scoped to a single concern per branch/PR where practical.
- If your change touches the database schema, include the corresponding Supabase migration and update `../api/database-overview.md` accordingly.
- If your change affects a documented API surface (`../api/`), update the relevant doc in the same PR.

## Testing Your Change

- Run through the relevant checklist(s) in `../testing/` for the area you changed.
- For anything touching checkout, auth, or admin, also review `../qa/edge-cases.md` and `../qa/security-tests.md`.

## Submitting a Pull Request

- Write a clear PR description: what changed, why, and how it was tested.
- Reference any related issue/ticket, if the team tracks work that way.
- Follow the commit message convention in `../Git-Workflow.md`.

## Code Review Expectations

- Be responsive to review feedback; prefer small, focused PRs that are easy to review over large multi-concern PRs.
- Reviewers should verify the change against `Coding-Standards.md` and confirm no unintended changes to generated files (`routeTree.gen.ts`) or config files were included.

## Related Documentation

- `../Git-Workflow.md`
- `../Branch-Strategy.md`
- `../Developer-Onboarding.md`
- `Coding-Standards.md`
