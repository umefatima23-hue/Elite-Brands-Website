# Elite Brands — Discount Rules (SOP)

Governs every price reduction shown on the storefront. Any exception requires written approval from `<<Owner / Head of Merchandising>>`.

Core principles:
1. Never display a discount that cannot be honoured.
2. One discount source per line item unless this document explicitly allows stacking.
3. Every discount has a start date, an end date, and an owner.
4. Margin floor: no order may settle below `<<15%>>` gross margin.

---

## 1. Percentage Discounts

| Rule | Value |
|---|---|
| Allowed increments | 5% steps (5, 10, 15 … 70) |
| Standard seasonal range | 10–30% |
| Clearance range | 40–70% |
| Maximum without approval | `<<30%>>` |
| Maximum with approval | `<<70%>>` |
| Rounding | Round final price down to nearest PKR 10 |

Operating rules:
- Percentage applies to the **compare-at (original) price**, never to an already-reduced price.
- Display format: `PKR 4,900` with `PKR 7,000` struck through and a `−30%` badge.
- Minimum display duration: `<<48>>` hours. No same-day on/off toggling.
- Price must have held at the original level for at least `<<14>>` days before being advertised as reduced.

---

## 2. Fixed Discounts

| Rule | Value |
|---|---|
| Typical values | PKR 500 / 1,000 / 2,000 |
| Minimum spend required | Yes — at least `<<3×>>` the discount value |
| Maximum without approval | `<<PKR 2,000>>` |
| Applies to | Cart subtotal, before shipping |

Operating rules:
- A fixed discount can never reduce a line item below `<<cost + 15%>>`.
- Fixed discounts are distributed proportionally across eligible items for refund calculations.
- Never combine a fixed cart discount with a fixed item discount on the same item.

---

## 3. Brand Exclusions

Some brands restrict discounting under supplier agreements.

| Brand tier | Discount policy |
|---|---|
| Protected / MAP brands | No discount at any time. Coupons must exclude them. |
| Restricted brands | Max `<<10%>>`, seasonal windows only, with brand approval on file. |
| Open brands | Full discount range permitted. |
| Own / unbranded lines | Full discount range permitted. |

Operating rules:
- Maintain an authoritative exclusion list in the admin coupon builder; never rely on memory.
- Excluded items must be visibly excluded in the coupon terms line: *"Not valid on `<<Brand A>>`, `<<Brand B>>`."*
- Excluded items still count toward a minimum-spend threshold **only if** the coupon terms say so; default is **no**.
- Bridal and couture categories are excluded from all sitewide coupons by default.

---

## 4. Sale Stacking

| Combination | Allowed? | Notes |
|---|---|---|
| Sale price + coupon code | ☐ No (default) | Enable only for named clearance events |
| Sale price + free shipping | ☑ Yes | Shipping is treated separately |
| Coupon + free shipping threshold | ☑ Yes | Threshold checked on post-discount subtotal |
| Coupon + coupon | ☐ No | One code per order, always |
| Bundle deal + coupon | ☐ No | Bundle price is final |
| Loyalty credit + coupon | ☑ Yes | Credit applies after the coupon |
| Percentage + fixed on same item | ☐ No | System picks the larger single benefit |

Conflict resolution: when two discounts collide, apply the one that gives the **customer** the greater benefit, then log the suppressed discount for reporting.

---

## 5. Coupon Policy

**Code format:** uppercase, 4–12 characters, no ambiguous characters (0/O, 1/I). Examples: `EID20`, `LAWN1000`, `WELCOME10`.

**Required fields for every coupon**
- Code, description, type (% or fixed), value
- Start datetime, end datetime (PKT)
- Minimum spend
- Usage limit (total) and usage limit (per customer)
- Eligible/excluded brands, categories, products
- First-order-only flag
- Stackable flag (default off)

**Standard coupon families**

| Family | Example | Value | Limit |
|---|---|---|---|
| Welcome | `WELCOME10` | 10% | First order only, 1 per customer |
| Newsletter | `INBOX500` | PKR 500 off PKR 5,000+ | 1 per customer |
| Seasonal campaign | `EID20` | 20% | Campaign window, unlimited |
| Recovery (abandoned cart) | `COMEBACK5` | 5% | 1 per customer, 7-day expiry |
| Service recovery | `SORRY-#####` | Case-by-case | Single use, named customer |
| Influencer | `<<NAME10>>` | 10% | Tracked, expiry required |

**Hard rules**
- No open-ended coupons. Every code carries an expiry.
- Never publish a code publicly that was issued for service recovery.
- Codes are case-insensitive at entry, stored uppercase.
- Expired or exhausted codes fail with a clear message, never silently.
- A coupon cannot make shipping negative or the order total below `<<PKR 0>>`.
- Refunds are calculated on the **amount actually paid**, not list price.

**Approval matrix**

| Discount depth | Approver |
|---|---|
| ≤ 15% | Merchandising lead |
| 16–30% | `<<Owner>>` |
| > 30% or protected brands | `<<Owner>>` + brand written consent |

---

## 6. Reporting

Track weekly:
- Discounted revenue share (target: below `<<35%>>`)
- Average discount depth per order
- Coupon redemption rate by code
- Margin after discount by category
- Number of manual/exception discounts granted

Retire any coupon with a redemption rate under `<<1%>>` after 30 days.
