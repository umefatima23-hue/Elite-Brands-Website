# Launch Checklist — First 200 Products

Use this document as the master gate before publishing the initial catalog on Elite Brands. Every row in `launch-inventory-template.csv` must satisfy each section below before its `Ready` flag flips to `Yes`.

## 1. Product Quality

- [ ] Product name follows `catalog-assets/BRAND_STYLE_GUIDE.md` (Title Case, no brand inside name, max 60 chars).
- [ ] Short description ≤ 140 characters, one sentence, no hype words.
- [ ] Long description 2–4 sentences describing fabric, cut, embellishment, styling.
- [ ] Fabric, season, color, pieces filled with approved vocabulary.
- [ ] Brand slug exists in `catalog-assets/brands.csv`.
- [ ] Category slug exists in `catalog-assets/categories.csv`.

## 2. SEO

- [ ] `meta_title` follows `<Product> — <Brand> | Elite Brands`, ≤ 60 chars, em dash.
- [ ] `meta_description` 140–160 chars, sentence case, ends with a period.
- [ ] Slug lowercase, hyphenated, ASCII only, ≤ 70 chars, unique.
- [ ] Alt text present for every uploaded image.
- [ ] No duplicate meta titles across products.

## 3. Images

- [ ] Hero image (`image_1`) present, clean front shot on neutral background.
- [ ] Minimum 2 images per product, up to 4 for soft launch.
- [ ] All filenames follow `<sku-lower>-<index>.jpg`.
- [ ] Resolution ≥ 2000×2500 px, sRGB, ≤ 500 KB per file.
- [ ] Files uploaded to `product-images/<product_id>/` after row creation.

## 4. Pricing

- [ ] `price` in whole PKR, no commas, no symbol.
- [ ] `compare_price` only set when `sale = true` and strictly greater than `price`.
- [ ] Margin reviewed and approved by merchandising.
- [ ] No placeholder prices (e.g., `1`, `999999`).

## 5. Inventory

- [ ] `stock` reflects physical count as of launch day − 1.
- [ ] Out-of-stock items kept with `stock = 0` (not deleted).
- [ ] Reserved units for photoshoot/PR excluded from live stock.
- [ ] Warehouse SKU tags match `sku` column exactly.

## 6. Sign-off

- [ ] Merchandising lead approval
- [ ] Content lead approval
- [ ] SEO lead approval
- [ ] Ops/warehouse approval
