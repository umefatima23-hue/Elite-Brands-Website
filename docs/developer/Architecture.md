# Architecture

## Overview

This document describes the expected high-level architecture of the Elite Brands Website, based on the declared stack: React, Vite, TanStack Router, Bun, TypeScript, TailwindCSS, shadcn/ui, Supabase, and Vercel.

> This should match the project's implementation. This document was produced without direct repository access and describes the conventional architecture for this stack. It must be reconciled against the actual codebase before being treated as authoritative.

## System Diagram (Conceptual)

```
┌─────────────────────────────┐
│         Browser (SPA)       │
│  React + TanStack Router    │
│  TailwindCSS + shadcn/ui    │
└──────────────┬───────────────┘
               │  Supabase JS client
               ▼
┌─────────────────────────────┐
│           Supabase           │
│  Postgres (RLS) + Auth       │
│  Storage (images/assets)     │
│  Edge Functions (optional)   │
└─────────────────────────────┘
               ▲
               │  build/deploy
┌─────────────────────────────┐
│            Vercel            │
│  Static hosting + CDN        │
│  Preview deployments         │
└─────────────────────────────┘
```

## Layers

### Presentation Layer

- React function components, styled with TailwindCSS utility classes and shadcn/ui primitives.
- Routing handled by TanStack Router, with file-based or code-based route definitions (confirm which — should match the project's implementation) compiled into `routeTree.gen.ts`.

### Application/State Layer

- Client-side state management pattern (React state/context, a dedicated state library, or TanStack Query for server state) — see `State-Management.md`.

### Data Layer

- Supabase acts as the backend: Postgres database, Auth, and Storage.
- The client talks to Supabase largely directly (via the Supabase JS client and RLS-enforced policies) rather than through a custom backend server — see `Supabase-Patterns.md`.

### Build & Deploy Layer

- Bun is used as the package manager/runtime for scripts.
- Vite handles bundling and dev server.
- Vercel hosts the built static output and provides preview deployments per branch/PR — see `Deployment-Pipeline.md`.

## Why This Architecture (Rationale, General)

A Supabase-backed SPA avoids maintaining a custom backend server, trading some flexibility for faster iteration — appropriate for a catalog/e-commerce site of this scale. This is a general rationale for the stack choice, not a confirmed statement of the team's actual reasoning.

## Related Documentation

- `Folder-Structure.md`
- `Supabase-Patterns.md`
- `TanStack-Router.md`
- `../api/supabase.md`
