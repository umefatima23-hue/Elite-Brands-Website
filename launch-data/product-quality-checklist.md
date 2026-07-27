# Product Quality Checklist

Applies to every product row before it moves to `Ready = Yes`.

## Naming Standards

- Title Case, no ALL CAPS, no emoji, no trailing punctuation.
- Never include the brand name inside the product name — the brand is a separate field.
- Max 60 characters including spaces.
- Preferred pattern: `<Color/Theme> <Embellishment> <Fabric/Silhouette>`.
  - ✅ `Rosewood Embroidered Lawn`
  - ✅ `Ivory Chikankari Pret`
  - ❌ `Sana Safinaz Rosewood Lawn Suit!!`

## Description Standards

- **Short description**: one sentence, ≤ 140 chars, describes the piece at a glance.
- **Long description**: 2–4 sentences. Cover fabric, cut, embellishment, dupatta/trouser, styling notes.
- Sentence case. One space after periods. No marketing hype (`stunning`, `must-have`, `exclusive`).
- Never invent claims that merchandising has not confirmed (thread count, origin, hand-stitch hours).

## Fabric Standards

- Use approved vocabulary: `Lawn`, `Cotton`, `Cotton Net`, `Chiffon`, `Karandi`, `Khaddar`, `Silk`, `Organza`, `Linen`, `Wool`.
- Title Case. One primary fabric per product; note secondary fabrics (e.g. dupatta) in the description.
- Reserved terms (`Pure Silk`, `Handcrafted`, `Chikankari`, `Zardozi`) only when verified.

## SKU Validation

- Pattern: `<BRAND>-<CATEGORY>-<###>`, uppercase, hyphenated.
- Brand code: 2–3 letters (SS, MB, GA, KH, SAP, ZS, EL, AJ, NL, CS).
- Category code: 2–3 letters (LL, PL, PR, UN, FE, FO, BR, WI, AC).
- Sequence: zero-padded 3+ digits, unique per brand+category.
- SKU must be globally unique and never reused, even after archival.

## Slug Validation

- Lowercase ASCII, hyphen-separated, no stopword stripping.
- Max ~70 characters, must be unique across the products table.
- Immutable after publish — corrections require a 301 redirect.
- Must be a readable version of the product name.
  - ✅ `rosewood-embroidered-lawn`
  - ❌ `rosewood_lawn_v2`, `RosewoodLawn`, `product-12345`
