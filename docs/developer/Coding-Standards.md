# Coding Standards

## Overview

General coding standards appropriate for a React + TypeScript + TailwindCSS + shadcn/ui codebase. These are baseline conventions to align on; actual enforced rules (linter/formatter config) should match the project's implementation.

> This should match the project's implementation. No ESLint/Prettier/TypeScript config was inspected to produce this document — confirm actual rules in the repository's config files (not modified here).

## TypeScript

- Prefer explicit types on function boundaries (parameters, return types) for exported/shared functions; local inference is acceptable within a function body.
- Avoid `any`; prefer `unknown` with narrowing, or precise types/interfaces.
- Shared types (e.g., `Product`, `Order`, `Brand`) should be defined once and reused, ideally generated from or kept in sync with the Supabase schema (see `Supabase-Patterns.md`).

## React

- Prefer function components with hooks; avoid class components.
- Keep components focused — extract shared logic into custom hooks rather than duplicating across components. (Referenced elsewhere in this doc set as living in `src/hooks/` — needs verification against current implementation.)
- Co-locate component-specific styles/logic; keep genuinely shared UI in a shared components location (referenced elsewhere as `src/components/` — needs verification against current implementation).

## Styling (TailwindCSS + shadcn/ui)

- Prefer Tailwind utility classes over custom CSS files for component styling.
- Use shadcn/ui primitives as the base for interactive components (buttons, dialogs, forms) rather than hand-rolling equivalents, for visual and accessibility consistency.
- Avoid inline style objects except for truly dynamic, non-reusable values.

## Naming Conventions

- Components: `PascalCase` (e.g., `ProductCard.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useCart.ts`)
- Route files: per TanStack Router's file-based routing convention, if used — see `TanStack-Router.md`

## Formatting & Linting

- Formatting and lint rules should be enforced via the project's actual Prettier/ESLint configuration (not inspected here). Run the project's lint/format scripts before committing — exact script names should match `package.json`.

## Commit-Level Expectations

- Keep commits focused; avoid mixing unrelated changes.
- See `../Git-Workflow.md` for commit message conventions.

## Related Documentation

- `Folder-Structure.md`
- `State-Management.md`
- `../Git-Workflow.md`
