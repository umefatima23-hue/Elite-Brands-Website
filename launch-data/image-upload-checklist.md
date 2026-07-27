# Image Upload Checklist

Every product ships with a hero image and up to three gallery images. Follow this checklist before flipping `images_complete = Yes` in the inventory CSV.

## Hero Image (`image_1`)

- [ ] Clean front shot of the primary garment.
- [ ] Neutral background (off-white/ivory), even studio lighting.
- [ ] Single model or flat lay — no lifestyle clutter.
- [ ] Fabric colour matches the physical piece; no filters or heavy retouching.

## Gallery Images (`image_2` – `image_4`)

- [ ] Back view (`image_2` recommended).
- [ ] Embroidery/detail close-up (`image_3`).
- [ ] Dupatta or styling shot (`image_4`).
- [ ] Consistent lighting and colour across the set.

## Technical Specs

- **Resolution**: 2000 × 2500 px (4:5 portrait). Never upscale from smaller sources.
- **Colour space**: sRGB.
- **File size**: ≤ 500 KB after export.
- **File format**: `.jpg` for photography. `.png` only when transparency is required (logos, flat cutouts).
- **File naming**: `<sku-lower>-<index>.<ext>` (`ss-ll-001-1.jpg`). No spaces, no capitals.

## Alt Text Rules

- Pattern: `<Product Name> — <angle/detail>, <Brand Name>`.
  - `Rosewood Embroidered Lawn — front view, Sana Safinaz`
  - `Rosewood Embroidered Lawn — embroidery detail, Sana Safinaz`
- Max 125 characters.
- Never leave alt text empty; blank alts fail accessibility and image SEO.

## Storage

- Upload to bucket `product-images` under `<product_id>/<filename>`.
- Stage pre-launch shots under `_staging/<sku-lower>/` until the product row exists.
- Keep originals in cold storage (not in the bucket) so future re-exports don't degrade quality.
