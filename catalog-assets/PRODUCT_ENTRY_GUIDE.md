# Product Entry Guide

For non-technical admins entering products into `products_import_template.csv` or the admin dashboard.

## Before you start

1. Confirm the brand exists in `brands.csv`. If not, add it there first.
2. Confirm the category exists in `categories.csv`.
3. Export product photos following `image_naming_guide.md`.
4. Have final pricing and stock counts from merchandising.

## Field-by-field

| Column              | Required | Rule                                                                 |
| ------------------- | -------- | -------------------------------------------------------------------- |
| `sku`               | Yes      | `BRAND-CAT-###`, uppercase. Unique. Never reuse.                     |
| `name`              | Yes      | Title Case, no brand name inside. Max 60 chars.                      |
| `slug`              | Yes      | Lowercase, hyphenated version of `name`. Immutable once live.        |
| `brand_slug`        | Yes      | Must match `brands.csv`.                                             |
| `category_slug`     | Yes      | Must match `categories.csv`.                                         |
| `price`             | Yes      | PKR, integer, no commas, no currency symbol.                         |
| `compare_price`     | No       | PKR original price if item is on sale. Must be greater than `price`. |
| `short_description` | Yes      | One sentence, max 140 chars. Shown on cards.                         |
| `description`       | Yes      | 2–4 sentences. Describe fabric, cut, styling. No hype words.         |
| `fabric`            | Yes      | e.g. Lawn, Chiffon, Cotton Net, Karandi.                             |
| `season`            | Yes      | Summer, Winter, All Season, Festive.                                 |
| `color`             | Yes      | Primary colour in plain English (`Dusty Rose`, `Ivory`).             |
| `pieces`            | Yes      | 1, 2, 3 or 4.                                                        |
| `stock`             | Yes      | Integer. `0` = out of stock but keep row.                            |
| `featured`          | Yes      | `true` / `false`. Featured items appear on the homepage.             |
| `new_arrival`       | Yes      | `true` / `false`. Auto-expires after 30 days operationally.          |
| `sale`              | Yes      | `true` / `false`. Must be `true` whenever `compare_price` is set.    |
| `meta_title`        | Yes      | Follow `SEO_GUIDE.md`.                                               |
| `meta_description`  | Yes      | Follow `SEO_GUIDE.md`.                                               |
| `image_1..image_4`  | Yes/opt  | `image_1` required. Filenames only, no folders.                      |

## SKU convention

`<BRAND>-<CATEGORY>-<###>`

- BRAND: 2–3 letter code (SS = Sana Safinaz, MB = Maria B, GA = Gul Ahmed).
- CATEGORY: 2–3 letter code (LL = Luxury Lawn, PR = Pret, UN = Unstitched, FE = Festive).
- ###: zero-padded sequence per brand+category.

Example: `SS-LL-001`, `SS-LL-002`, `MB-PR-014`.

## Do

- Copy an existing row and edit — don't build from scratch.
- Save the CSV as UTF-8.
- Wrap any field containing a comma in double quotes.
- Preview the row on staging before publishing.

## Don't

- Don't include the brand name inside the product name.
- Don't use ALL CAPS or emoji.
- Don't set `sale = true` without a `compare_price`.
- Don't rename a slug or SKU after launch.
- Don't leave `meta_title` or `meta_description` blank.

## Handoff checklist

- [ ] Row validates against the template columns (same order, same headers).
- [ ] Images uploaded and filenames match `image_1..image_4`.
- [ ] Meta title ≤ 60 chars; meta description 140–160 chars.
- [ ] Price and compare_price consistent with the `sale` flag.
- [ ] Category and brand slugs exist.
