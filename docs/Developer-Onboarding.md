# Developer Onboarding Guide

## Overview

Steps for a new developer to get the Elite Brands Website running locally and oriented within the codebase.

> This should match the project's implementation. Exact commands, environment variable names, and prerequisites should be confirmed against the actual `package.json`, `.env.example` (if present), and Supabase project configuration.

## Prerequisites

- [Bun](https://bun.sh) installed (project uses `bun.lock`)
- A Supabase project (either shared team dev project or a personal one), with the schema applied — confirm process with the team
- Git access to the repository

## Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/umefatima23-hue/Elite-Brands-Website.git
   cd Elite-Brands-Website
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   Create a local env file (name/format should match the project's implementation, conventionally `.env.local` for Vite projects) with at minimum:

   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Obtain these values from a team lead or the Supabase project dashboard. **Never commit this file.**

4. **Run the dev server**

   ```bash
   bun run dev
   ```

   (Confirm actual script name in `package.json`.)

5. **Verify the app loads** — the catalog page should load and display products if your configured Supabase project has seed data.

## Orientation

- Read `developer/Architecture.md` for the system overview.
- Read `developer/Folder-Structure.md` to understand where things live.
- Read `developer/Coding-Standards.md` before making changes.
- Read `Branch-Strategy.md` and `Git-Workflow.md` before your first commit.

## Admin Access

To test admin features locally, you'll need a Supabase user account flagged as an admin (mechanism should match the project's implementation — see `api/authentication.md`). Ask a team lead how test admin accounts are provisioned in the shared/dev Supabase project.

## Getting Help

- Check `README.md` (the documentation index) first — this documentation set is the intended source of truth for onboarding, architecture, testing, and operations.
- Where this documentation says "This should match the project's implementation," that indicates an area not yet verified against the real code — ask a teammate and consider updating the doc once confirmed.

## Related Documentation

- `developer/Architecture.md`
- `developer/Contributing.md`
- `Git-Workflow.md`
- `Branch-Strategy.md`
