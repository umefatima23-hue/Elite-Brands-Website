# Image Naming Guide

Consistent filenames keep uploads searchable, sortable and safe to re-import.

## Format

```
<sku-lower>-<index>.<ext>
```

- `sku-lower` — the product SKU in lowercase, hyphenated (no spaces, no underscores).
- `index` — 1-based ordering. `1` is the primary/hero image.
- `ext` — `jpg` for photography, `png` only when transparency is required.

## Examples

| SKU          | File                |
| ------------ | ------------------- |
| SS-LL-001    | `ss-ll-001-1.jpg`   |
| SS-LL-001    | `ss-ll-001-2.jpg`   |
| MB-PR-014    | `mb-pr-014-1.jpg`   |

## Rules

- Lowercase only. No spaces, no capitals, no special characters other than `-`.
- Max 4 images per product for the soft launch (`-1` to `-4`).
- Primary image (`-1`) must be a clean front shot on a neutral background.
- Secondary images: back, detail/embroidery close-up, dupatta or styling shot.
- Target 2000×2500 px, sRGB, under 500 KB after export.
- Save originals separately; only optimized web copies go into the bucket.
- Never rename after upload — the CSV column `image_1..image_4` must match exactly.

## Storage Path

Upload to the `product-images` bucket at:

```
<product_id>/<filename>
```

`product_id` is assigned after the product row is created. Until then, stage files under a temporary folder named after the SKU: `_staging/<sku-lower>/`.
