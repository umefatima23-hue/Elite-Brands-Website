# Admin Guide: Products

## Overview

How administrators manage the product catalog through the admin UI.

> This should match the project's implementation for exact form fields and validation rules.

## Creating a Product

Expected required fields, per `../api/catalog.md`:

- Name
- Description
- Price
- Brand (selected from existing brands)
- Category (selected from existing categories)
- Images (uploaded to Supabase Storage, see `../api/storage.md`)
- Stock quantity

## Editing a Product

- All fields above are expected to be editable after creation.
- Changes should propagate immediately to the storefront catalog view.

## Deleting a Product

- Deleting a product is expected to remove it from the storefront catalog. Whether existing orders that reference the product retain historical data after deletion should match the project's implementation.

## Managing Images

- Admins can upload one or more images per product.
- The first/primary image is expected to be used as the catalog thumbnail.

## Related Documentation

- `../api/catalog.md`
- `../api/storage.md`
- `../testing/catalog-testing.md`
- `../testing/inventory-testing.md`
