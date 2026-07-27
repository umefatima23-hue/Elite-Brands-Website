# SEO Product Checklist

Complete for every product before publish. Aligned with `catalog-assets/SEO_GUIDE.md`.

## Meta Title

- [ ] Format: `<Product Name> — <Brand Name> | Elite Brands`
- [ ] ≤ 60 characters including the suffix.
- [ ] Em dash `—` (not hyphen).
- [ ] Title Case for product and brand.
- [ ] Unique across the catalog.

## Meta Description

- [ ] 140–160 characters.
- [ ] Sentence case, ends with a period.
- [ ] Opens with a one-line product hook.
- [ ] Mentions brand + category context.
- [ ] Ends with `Free delivery across Pakistan.`
- [ ] No emoji, no ALL CAPS, no price, no HTML.

## URL Slug

- [ ] `/products/<slug>` — lowercase, hyphenated, ASCII only.
- [ ] Readable version of the product name (no stopword stripping).
- [ ] ≤ 70 characters.
- [ ] Unique and immutable after publish.

## Image Alt Text

- [ ] Every image has alt text following `<Product> — <angle>, <Brand>`.
- [ ] Distinct alt text per image (front, back, detail, styling).
- [ ] Max 125 characters per alt.

## Canonical & Structured Data

- [ ] Canonical URL points to `/products/<slug>` (no query strings).
- [ ] No conflicting canonical from category or brand pages.
- [ ] JSON-LD `Product` schema present with `name`, `image`, `description`, `sku`, `brand`, `offers.price`, `offers.priceCurrency = PKR`, `offers.availability`.
- [ ] Availability matches live stock (`InStock` / `OutOfStock`).
- [ ] No duplicate content: descriptions differ from other products by ≥ 30%.
