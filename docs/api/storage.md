# Storage Architecture

## Overview

File and image storage (product images, brand logos, and any other binary assets) is expected to be handled via **Supabase Storage**, consistent with the rest of the backend stack. This document describes the conventional bucket/object structure and should be reconciled against the actual Supabase Storage configuration.

> This should match the project's implementation. Bucket names, path conventions, and access policies were not inspected and must be confirmed against the project's Supabase configuration.

## Expected Buckets

| Bucket (convention) | Purpose | Public/Private |
|---|---|---|
| `product-images` | Product photography used in the catalog | Public read |
| `brand-assets` | Brand logos and marketing imagery | Public read |
| `avatars` | Customer/admin profile images, if applicable | Public read or private, depending on implementation |

Actual bucket names and structure should match the project's implementation.

## Path Conventions (Illustrative)

```
product-images/
  {product_id}/
    primary.jpg
    gallery-1.jpg
    gallery-2.jpg

brand-assets/
  {brand_id}/
    logo.png
```

## Access Control

- **Public buckets** (e.g., product images) are typically world-readable so they can be rendered directly in `<img>` tags via their public URL, with writes restricted to admin users through Storage policies.
- **Private buckets**, if any, require signed URLs generated server-side or via an Edge Function.

This should match the project's implementation — confirm actual Storage RLS/bucket policies.

## Upload Flow (Conceptual, Admin)

1. Admin selects/uploads an image in the admin product form.
2. Client uploads the file directly to the relevant Supabase Storage bucket using the Supabase JS client (`supabase.storage.from(bucket).upload(...)`).
3. On success, the returned public URL (or storage path) is saved on the corresponding `products`/`brands` row.

## Image Optimization

Whether images are resized/optimized client-side before upload, via Supabase Storage transformations, or via a CDN/Vercel image optimization layer is unconfirmed. This should match the project's implementation.

## Related Documentation

- `catalog.md` — how stored image URLs are surfaced in product records
- `supabase.md` — overall Supabase integration
- `../admin-guide/products.md` — admin workflow for managing product images
