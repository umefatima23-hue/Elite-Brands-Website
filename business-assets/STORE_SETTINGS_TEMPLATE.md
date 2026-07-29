# Elite Brands — Store Settings Template

Reference list of every configurable store setting. Fill the **Value** column, then mirror it into the admin panel. Keep this file and the admin panel in sync; this file is the record of intent, the panel is the live state.

---

## 1. Store Identity

| Setting | Value | Notes |
|---|---|---|
| Store name | `<<Elite Brands>>` | Shown in header, emails, invoices |
| Legal entity name | `<<...>>` | Invoices and policy pages |
| Tagline | `<<Pakistan's designer wear, curated.>>` | Homepage + meta |
| Logo (light bg) | `<<file>>` | SVG preferred |
| Logo (dark bg) | `<<file>>` | SVG preferred |
| Favicon | `<<file>>` | 32×32 + 180×180 |
| Brand colours | Obsidian / Ivory / Gold | Locked |
| Default language | `en-PK` | |
| Store status | `<<Live / Soft launch>>` | |

---

## 2. Currency & Formatting

| Setting | Value |
|---|---|
| Currency | PKR |
| Currency symbol | `Rs` / `PKR` |
| Symbol position | Prefix |
| Thousands separator | `,` |
| Decimal places | 0 |
| Price display | `PKR 4,900` |
| Prices include tax | `<<No>>` |
| Rounding rule | Nearest PKR 10 |

---

## 3. Timezone, Dates & Hours

| Setting | Value |
|---|---|
| Timezone | `Asia/Karachi (PKT, UTC+5)` |
| Date format | `DD MMM YYYY` |
| Time format | 24-hour |
| Week starts | Monday |
| Order cut-off time | `<<16:00 PKT>>` |
| Working days | `<<Mon–Sat>>` |
| Public holidays observed | `<<list>>` |

---

## 4. Contact Details

| Setting | Value |
|---|---|
| Support email | `<<support@elitebrands.pk>>` |
| Orders email | `<<orders@elitebrands.pk>>` |
| Support phone | `<<+92 3XX XXXXXXX>>` |
| WhatsApp number | `<<+92 3XX XXXXXXX>>` |
| WhatsApp click-to-chat | `<<https://wa.me/92XXXXXXXXXX>>` |
| Registered address | `<<...>>` |
| Returns address | `<<...>>` |
| Transactional sender | `<<no-reply@elitebrands.pk>>` |

---

## 5. Shipping

| Setting | Value |
|---|---|
| Zones enabled | Zone 1–4 |
| International shipping | `<<Off>>` |
| Free shipping threshold | `<<PKR 5,000>>` |
| Free shipping zones | 1–3 |
| Default shipping rate | `<<PKR 249>>` |
| Express shipping | `<<On / Off>>`, `<<PKR 500>>` |
| Processing time shown | `<<1–2 working days>>` |
| Default courier | `<<Courier A>>` |
| Fallback courier | `<<Courier B>>` |
| COD enabled | `<<Yes>>` |
| COD order cap | `<<PKR 30,000>>` |
| Tracking link template | `<<https://courier.example/track/{tracking}>>` |

Detailed rules: `SHIPPING_ZONES.md`.

---

## 6. Payments

| Setting | Value |
|---|---|
| Cash on Delivery | `<<Enabled>>` |
| Bank Transfer | `<<Enabled>>` |
| Easypaisa | `<<Enabled>>` |
| JazzCash | `<<Enabled>>` |
| Online gateway | `<<Disabled>>` |
| Payment hold window | `<<24 h>>` |
| Auto-cancel unpaid after | `<<48 h>>` |
| Invoice prefix | `<<EB-INV->>` |
| Order number prefix | `EB-` |

Detailed rules: `PAYMENT_METHODS.md`.

---

## 7. Tax

| Setting | Value |
|---|---|
| Tax enabled | `<<No>>` |
| Default tax rate | `<<0%>>` |
| Tax label | `<<Sales Tax>>` |
| NTN shown on invoice | `<<Yes / No>>` |
| Tax-inclusive pricing | `<<No>>` |

---

## 8. SEO Defaults

| Setting | Value |
|---|---|
| Default meta title pattern | `{page} — Elite Brands` |
| Homepage title | `<<Elite Brands — Pakistani Designer Wear Online>>` |
| Default meta description | `<<Shop premium Pakistani designer lawn, pret and festive wear. Nationwide delivery, easy returns.>>` |
| Product title pattern | `{product} — {brand} \| Elite Brands` |
| Category title pattern | `{category} \| Elite Brands` |
| Canonical domain | `<<https://elitebrands.pk>>` |
| Default OG image | `<<absolute https URL, 1200×630>>` |
| Twitter card type | `summary_large_image` |
| Robots policy | `index, follow` |
| Sitemap URL | `<<https://elitebrands.pk/sitemap.xml>>` |
| Structured data | Product, Organization, BreadcrumbList |

---

## 9. Social Links

| Platform | URL | Show in footer |
|---|---|---|
| Instagram | `<<...>>` | ☑ |
| Facebook | `<<...>>` | ☑ |
| TikTok | `<<...>>` | ☑ |
| Pinterest | `<<...>>` | ☐ |
| YouTube | `<<...>>` | ☐ |
| WhatsApp | `<<...>>` | ☑ |

---

## 10. Support Hours

| Setting | Value |
|---|---|
| WhatsApp hours | `<<Mon–Sat, 10:00–19:00 PKT>>` |
| Phone hours | `<<Mon–Sat, 11:00–18:00 PKT>>` |
| Email response SLA | `<<Within 24 h>>` |
| Out-of-hours auto-reply | `<<On>>` |
| Holiday message | `<<text>>` |

---

## 11. Notifications

| Event | Email | WhatsApp |
|---|---|---|
| Order placed | ☑ | ☑ |
| Payment received | ☑ | ☑ |
| Order shipped + tracking | ☑ | ☑ |
| Out for delivery | ☐ | ☑ |
| Delivered | ☑ | ☑ |
| Return authorised | ☑ | ☑ |
| Refund issued | ☑ | ☑ |
| Abandoned cart | ☑ | ☐ |
| Newsletter | ☑ | ☐ |

Templates: `launch-content/email-templates.md`, `launch-content/whatsapp-templates.md`.

---

## 12. Catalog Behaviour

| Setting | Value |
|---|---|
| Products per page | `<<24>>` |
| Default sort | `<<Newest>>` |
| Show out-of-stock products | `<<Yes, marked Sold Out>>` |
| Low-stock threshold | `<<3>>` |
| Back-in-stock alerts | `<<Off>>` |
| Reviews enabled | `<<Off at soft launch>>` |
| Wishlist enabled | `<<Yes>>` |
| Guest checkout | `<<Yes>>` |

---

## 13. Maintenance Mode

| Setting | Value |
|---|---|
| Maintenance mode | `<<Off>>` |
| Maintenance headline | `<<We're preparing something beautiful.>>` |
| Maintenance body | `<<Our store is briefly offline for updates. We'll be back shortly.>>` |
| Expected return time shown | `<<Yes>>` |
| Allowlisted IPs / admin bypass | `<<...>>` |
| Contact shown during downtime | WhatsApp + email |
| Status page / social notice | `<<Instagram story>>` |

---

## 14. Analytics & Tracking

| Setting | Value |
|---|---|
| Google Analytics 4 ID | `<<G-XXXXXXX>>` |
| Meta Pixel ID | `<<...>>` |
| TikTok Pixel ID | `<<...>>` |
| Google Search Console | `<<verified>>` |
| Consent banner | `<<On / Off>>` |
| Conversion events tracked | view_item, add_to_cart, begin_checkout, purchase |

---

## 15. Change Log

| Date | Setting changed | Old → New | Changed by |
|---|---|---|---|
| `<<DD-MM-YYYY>>` | | | |
