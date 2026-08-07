# Admin Guide: Brands

## Overview

How administrators manage brand records used to organize and filter the catalog.

> This should match the project's implementation for exact form fields.

## Creating a Brand

Expected fields:

- Name
- Slug (URL-friendly identifier, possibly auto-generated from name)
- Logo/brand image (see `../api/storage.md`)
- Description (optional)

## Editing a Brand

- Name, slug, logo, and description should be editable after creation.
- Changing a brand's slug may affect existing storefront URLs referencing it — this should be handled carefully and should match the project's implementation.

## Deleting a Brand

- Deleting a brand that still has associated products requires a defined behavior (block deletion, cascade, or unset the product's brand). This should match the project's implementation — see also `../qa/edge-cases.md`.

## Related Documentation

- `../api/catalog.md`
- `../testing/admin-testing.md`
- `categories.md`
