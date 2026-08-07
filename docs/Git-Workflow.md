# Git Workflow Guide

## Overview

A conventional Git workflow for contributing to the Elite Brands Website, assuming a typical feature-branch-plus-pull-request model (consistent with the observed `feature/mobile1-admin-ui` branch naming).

> This should match the project's implementation for any team-specific conventions (required reviewers, merge strategy, CI gating) not captured here.

## Daily Workflow

1. **Sync with the base branch**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a feature branch** (see `Branch-Strategy.md` for naming)

   ```bash
   git checkout -b feature/short-description
   ```

3. **Make focused commits** as you work — see commit message convention below.

4. **Keep your branch up to date** with the base branch periodically to reduce merge conflicts:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

   (Or `git merge origin/main`, depending on team preference — confirm which the team uses.)

5. **Push your branch and open a pull request**

   ```bash
   git push origin feature/short-description
   ```

6. **Address review feedback** with additional commits (or amend/squash, per team preference) until approved.

7. **Merge** per the repository's configured merge strategy (merge commit, squash, or rebase — confirm actual setting in the repo).

## Commit Message Convention (Suggested)

Following a Conventional Commits style, if not already established otherwise:

```
<type>: <short description>

[optional longer description]
```

Common types:

- `feat:` — a new feature
- `fix:` — a bug fix
- `docs:` — documentation-only changes (e.g., this commit)
- `refactor:` — code change that doesn't add a feature or fix a bug
- `test:` — adding or updating tests
- `chore:` — tooling/dependency/config changes

Example: `docs: add developer and onboarding documentation`

## What Not to Do

- Don't commit directly to `main`/production branch — always go through a pull request.
- Don't commit generated files that should stay out of version control (confirm `.gitignore` coverage) or hand-edit generated files like `routeTree.gen.ts`.
- Don't commit secrets (Supabase service role key, `.env.local`, etc.).

## Related Documentation

- `Branch-Strategy.md`
- `Versioning-Guide.md`
- `developer/Contributing.md`
