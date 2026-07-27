# SEO Guide — Elite Brands

Every product, category and brand page must ship with consistent metadata. Follow the formats below verbatim.

## Meta Title

**Format:** `<Product Name> — <Brand Name> | Elite Brands`

- Max 60 characters (including brand suffix).
- Title Case for product and brand.
- Use the em dash `—`, not a hyphen.

**Examples**
- `Rosewood Embroidered Lawn — Sana Safinaz | Elite Brands`
- `Ivory Chikankari Kurta — Maria B | Elite Brands`

## Meta Description

**Format:** `<One-line product hook>. <Brand + category context>. Free delivery across Pakistan.`

- 140–160 characters.
- Sentence case, ends with a period.
- No emoji, no ALL CAPS, no price.
- Must read naturally — this is what appears in Google.

**Example**
`Shop the Rosewood 3-piece embroidered lawn suit by Sana Safinaz. Hand-finished luxury lawn. Free delivery across Pakistan.`

## URL Structure

| Type     | Pattern                       | Example                                      |
| -------- | ----------------------------- | -------------------------------------------- |
| Product  | `/products/<product-slug>`    | `/products/rosewood-embroidered-lawn`        |
| Category | `/category/<category-slug>`   | `/category/luxury-lawn`                      |
| Brand    | `/brand/<brand-slug>`         | `/brand/sana-safinaz`                        |
| Sale     | `/category/sale`              | `/category/sale`                             |

### Slug rules

- Lowercase, hyphen-separated, ASCII only.
- No stopwords stripping — keep the product name intact and readable.
- Max ~70 characters.
- Slugs are immutable once published. Correct via 301 if a change is unavoidable.

## Image SEO

- `alt` text: `<Product Name> — <angle/detail>, <Brand Name>`.
  - e.g. `Rosewood Embroidered Lawn — front view, Sana Safinaz`.
- Filenames follow `image_naming_guide.md`.

## Structured Data

Every product page emits JSON-LD `Product` with `name`, `image`, `description`, `sku`, `brand`, `offers.price`, `offers.priceCurrency = PKR`, `offers.availability`.
