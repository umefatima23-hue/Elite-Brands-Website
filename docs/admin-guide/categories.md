# Admin Guide: Categories

## Overview

How administrators manage product categories used to organize and filter the catalog.

> This should match the project's implementation for exact form fields and whether nested/hierarchical categories are supported.

## Creating a Category

Expected fields:

- Name
- Slug
- Description (optional)
- Parent category (if hierarchical categories are supported — should match the project's implementation)

## Editing a Category

- Name, slug, and description should be editable after creation.

## Deleting a Category

- As with brands, deleting a category with associated products requires a defined behavior (block, cascade, or unset). This should match the project's implementation — see `../qa/edge-cases.md`.

## Related Documentation

- `../api/catalog.md`
- `brands.md`
- `../testing/admin-testing.md`
