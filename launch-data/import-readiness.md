# Import Readiness — CSV → Supabase

Follow this procedure to verify the product CSV before importing into the `public.products` table.

## 1. File Sanity

- [ ] File encoded as UTF-8 (no BOM).
- [ ] Line endings LF (`\n`), not CRLF.
- [ ] Column order and headers match `catalog-assets/products_import_template.csv` exactly.
- [ ] Fields containing commas or quotes are wrapped in double quotes.
- [ ] No trailing empty rows.

## 2. Required Fields

For every row confirm the following are non-empty:
`sku, name, slug, brand_slug, category_slug, price, short_description, description, fabric, season, color, pieces, stock, featured, new_arrival, sale, meta_title, meta_description, image_1`.

## 3. Referential Checks

- [ ] Every `brand_slug` exists in `catalog-assets/brands.csv`.
- [ ] Every `category_slug` exists in `catalog-assets/categories.csv`.
- [ ] No duplicate `sku` values.
- [ ] No duplicate `slug` values.

## 4. Value Validation

| Column           | Rule                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `price`          | Integer > 0, no commas, no currency symbol.                          |
| `compare_price`  | Empty or integer > `price`.                                          |
| `stock`          | Integer ≥ 0.                                                         |
| `pieces`         | 1, 2, 3, or 4.                                                       |
| `featured`       | `true` or `false`.                                                   |
| `new_arrival`    | `true` or `false`.                                                   |
| `sale`           | `true` only when `compare_price` is set.                             |
| `meta_title`     | ≤ 60 characters.                                                     |
| `meta_description` | 140–160 characters.                                                |
| `slug`           | `^[a-z0-9]+(-[a-z0-9]+)*$`, ≤ 70 chars.                              |
| `sku`            | `^[A-Z0-9]+-[A-Z0-9]+-[0-9]{3,}$`.                                   |

## 5. Local Dry Run

1. Load the CSV into a spreadsheet or DuckDB (`read_csv_auto`) and run the validations above as filters.
2. Export any failing rows to `launch-data/_errors.csv` and fix in source before re-running.
3. Confirm row count matches the merchandising sign-off count (target: 200).

## 6. Staging Import

- [ ] Import into the **staging** Supabase project first, never production.
- [ ] Verify a random sample of 10 products render correctly on the staging storefront.
- [ ] Check `product-images` bucket paths resolve for `image_1..image_4`.
- [ ] Diff staging vs. source CSV: no silent truncation, no encoding artefacts (`â€™`, `Ã©`).

## 7. Production Import

- [ ] Take a database snapshot before import.
- [ ] Import inside a transaction; roll back on any FK or constraint failure.
- [ ] Set `status = 'draft'` on import, flip to `active` in a controlled second step after final QA.
- [ ] Record import metadata (operator, timestamp, source file hash) in the ops log.
