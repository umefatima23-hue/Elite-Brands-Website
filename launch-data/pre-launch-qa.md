# Pre-Launch QA Checklist

Run this pass on staging before flipping any product to `active` in production.

## 1. Catalog Integrity

- [ ] All 200 SKUs unique; no duplicates or reused SKUs.
- [ ] All slugs unique across brands, categories, and products.
- [ ] Every product references an existing brand and category slug.
- [ ] No product left in `draft` status by mistake.

## 2. Content QA

- [ ] Spellcheck run on every name, short description, long description, meta title, meta description.
- [ ] No placeholder text (`lorem ipsum`, `TBD`, `xxx`).
- [ ] Brand names spelled per `catalog-assets/BRAND_STYLE_GUIDE.md`.
- [ ] Reserved terms (`Chikankari`, `Pure Silk`, `Handcrafted`) verified with merchandising.

## 3. Pricing QA

- [ ] Every price is a positive integer in PKR.
- [ ] `compare_price > price` whenever `sale = true`.
- [ ] `sale = false` rows have `compare_price` empty.
- [ ] Spot-check 20 random SKUs against the merch pricing sheet.

## 4. Inventory QA

- [ ] Stock counts reconciled with warehouse export from launch day − 1.
- [ ] Featured products all have `stock ≥ 5`.
- [ ] No negative stock; out-of-stock items keep row with `stock = 0`.

## 5. Media QA

- [ ] Every product has `image_1` and at least one gallery image.
- [ ] All image files exist in `product-images/<product_id>/`.
- [ ] No broken image references (filename in CSV matches uploaded file).
- [ ] Alt text set on every image.

## 6. Rendering QA (staging)

- [ ] PDP renders: hero, gallery, price, compare price, description, add-to-cart.
- [ ] Meta title and description visible in page source `<head>`.
- [ ] JSON-LD `Product` validates in Google Rich Results test.
- [ ] Category and brand pages list the new products with correct thumbnails.
- [ ] Mobile (360 px) and desktop (1440 px) both render without overflow.

## 7. Ops Readiness

- [ ] Support team briefed on launch SKUs and return policy edge cases.
- [ ] Fulfilment SLAs confirmed with warehouse.
- [ ] Marketing assets (banner, email, social) approved.
- [ ] Rollback plan documented (how to bulk-set `status = 'draft'` if needed).
