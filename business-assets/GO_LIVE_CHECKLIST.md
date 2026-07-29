# Elite Brands — Go-Live Checklist

Final production gate. Nothing ships until every **Blocker** item is checked. Owner and date required per line.

Legend: **B** = blocker, **H** = high, **N** = nice-to-have.

---

## 1. Domain

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 1.1 | Domain registered and in our account | B | | ☐ |
| 1.2 | Auto-renew enabled, expiry > 6 months out | B | | ☐ |
| 1.3 | Registrar 2FA enabled | B | | ☐ |
| 1.4 | DNS A/CNAME records point to hosting | B | | ☐ |
| 1.5 | `www` → apex (or apex → `www`) redirect works | B | | ☐ |
| 1.6 | Email DNS (MX, SPF, DKIM, DMARC) resolving | B | | ☐ |
| 1.7 | Domain privacy enabled | N | | ☐ |

## 2. SSL

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 2.1 | Valid certificate on apex and `www` | B | | ☐ |
| 2.2 | HTTP → HTTPS redirect enforced | B | | ☐ |
| 2.3 | No mixed-content warnings on any page | B | | ☐ |
| 2.4 | Auto-renewal confirmed | B | | ☐ |
| 2.5 | HSTS considered | N | | ☐ |

## 3. Hosting / Vercel

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 3.1 | Production project connected to the correct repo/branch | B | | ☐ |
| 3.2 | Production build passes with zero errors | B | | ☐ |
| 3.3 | Environment variables set for production (not preview only) | B | | ☐ |
| 3.4 | No secrets committed to the repository | B | | ☐ |
| 3.5 | Custom domain attached and verified | B | | ☐ |
| 3.6 | Preview deployments not indexable | H | | ☐ |
| 3.7 | Build logs reviewed for warnings | H | | ☐ |
| 3.8 | Rollback to previous deployment tested | B | | ☐ |

## 4. Database / Supabase

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 4.1 | All migrations applied to production | B | | ☐ |
| 4.2 | Row Level Security enabled on every public table | B | | ☐ |
| 4.3 | Policies reviewed — no unintended public write access | B | | ☐ |
| 4.4 | Grants present for every table the app reads/writes | B | | ☐ |
| 4.5 | Storage buckets created with correct visibility | B | | ☐ |
| 4.6 | Storage policies restrict uploads to admins | B | | ☐ |
| 4.7 | Service keys stored server-side only | B | | ☐ |
| 4.8 | Indexes applied for catalog and order queries | H | | ☐ |
| 4.9 | Seed/test data removed from production | B | | ☐ |

## 5. Authentication

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 5.1 | Sign-up, sign-in, sign-out tested end to end | B | | ☐ |
| 5.2 | Password reset email delivers and works | B | | ☐ |
| 5.3 | Email confirmation behaviour decided and tested | B | | ☐ |
| 5.4 | Redirect / callback URLs set to the production domain | B | | ☐ |
| 5.5 | Protected routes reject unauthenticated users | B | | ☐ |
| 5.6 | Admin access limited to intended accounts | B | | ☐ |
| 5.7 | Session persistence verified after refresh | H | | ☐ |
| 5.8 | Auth emails branded and free of typos | H | | ☐ |

## 6. Products

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 6.1 | Minimum `<<200>>` products live | B | | ☐ |
| 6.2 | Every product has brand, category, price, stock | B | | ☐ |
| 6.3 | Slugs unique, lowercase, no duplicates | B | | ☐ |
| 6.4 | SKUs unique and follow the naming pattern | B | | ☐ |
| 6.5 | Prices verified against the source sheet | B | | ☐ |
| 6.6 | Compare-at prices honest and defensible | B | | ☐ |
| 6.7 | Stock counts match physical inventory | B | | ☐ |
| 6.8 | Descriptions proofread, no placeholder text | B | | ☐ |
| 6.9 | Size and fabric fields populated | H | | ☐ |
| 6.10 | Sold-out items display correctly | H | | ☐ |

## 7. Images

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 7.1 | Every product has a hero image | B | | ☐ |
| 7.2 | Minimum `<<3>>` gallery images per product | H | | ☐ |
| 7.3 | Consistent aspect ratio across the grid | B | | ☐ |
| 7.4 | No broken image links sitewide | B | | ☐ |
| 7.5 | Alt text present on every product image | B | | ☐ |
| 7.6 | Images compressed (< `<<300 KB>>` each) | H | | ☐ |
| 7.7 | Lazy loading enabled below the fold | H | | ☐ |
| 7.8 | Banner images render correctly on mobile | H | | ☐ |

## 8. SEO

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 8.1 | Unique title and meta description on every route | B | | ☐ |
| 8.2 | Single H1 per page | H | | ☐ |
| 8.3 | Canonical tags correct | H | | ☐ |
| 8.4 | `robots.txt` allows indexing of production only | B | | ☐ |
| 8.5 | `sitemap.xml` generated and submitted | B | | ☐ |
| 8.6 | Google Search Console verified | B | | ☐ |
| 8.7 | Open Graph + Twitter card images render in preview | H | | ☐ |
| 8.8 | Product JSON-LD validates | H | | ☐ |
| 8.9 | 404 page styled and useful | H | | ☐ |
| 8.10 | No `noindex` left on live pages | B | | ☐ |

## 9. Analytics

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 9.1 | GA4 installed and receiving real-time data | B | | ☐ |
| 9.2 | Meta Pixel firing on page view | H | | ☐ |
| 9.3 | Purchase event fires once per order, correct value | B | | ☐ |
| 9.4 | add_to_cart and begin_checkout tracked | H | | ☐ |
| 9.5 | Internal traffic filtered | N | | ☐ |
| 9.6 | Consent banner behaviour confirmed | H | | ☐ |

## 10. WhatsApp

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 10.1 | Business number live and reachable | B | | ☐ |
| 10.2 | Click-to-chat link opens with the right prefilled text | B | | ☐ |
| 10.3 | Floating chat button visible on mobile and desktop | H | | ☐ |
| 10.4 | Greeting and away messages configured | H | | ☐ |
| 10.5 | Order status quick replies loaded | H | | ☐ |
| 10.6 | Support hours published on site and profile | H | | ☐ |
| 10.7 | Team briefed on response SLAs | B | | ☐ |

## 11. Backup

| # | Item | Pri | Owner | ☐ |
|---|---|---|---|---|
| 11.1 | Database backup taken immediately before launch | B | | ☐ |
| 11.2 | Automatic daily backups enabled | B | | ☐ |
| 11.3 | Restore procedure tested at least once | B | | ☐ |
| 11.4 | Product CSV master copy archived off-platform | H | | ☐ |
| 11.5 | Image library backed up | H | | ☐ |
| 11.6 | Repository has a tagged pre-launch release | H | | ☐ |
| 11.7 | Credentials stored in a password manager | B | | ☐ |

## 12. Smoke Tests (run on production, after DNS cutover)

| # | Test | Expected | ☐ |
|---|---|---|---|
| 12.1 | Load homepage on mobile and desktop | Under 3 s, no layout break | ☐ |
| 12.2 | Browse a category, apply a filter | Correct products shown | ☐ |
| 12.3 | Open a product page | Images, price, stock, size all correct | ☐ |
| 12.4 | Add to cart, update quantity, remove | Totals recalculate correctly | ☐ |
| 12.5 | Apply a valid coupon | Discount applied per rules | ☐ |
| 12.6 | Apply an invalid/expired coupon | Clear error message | ☐ |
| 12.7 | Complete a COD checkout | Order created, email + WhatsApp sent | ☐ |
| 12.8 | Complete a bank-transfer checkout | Status `awaiting_payment`, details shown | ☐ |
| 12.9 | Register a new account | Confirmation received, login works | ☐ |
| 12.10 | View orders in the account area | Order appears with correct data | ☐ |
| 12.11 | Add to wishlist, reload | Item persists | ☐ |
| 12.12 | Submit the contact/support form | Reaches the support inbox | ☐ |
| 12.13 | Free-shipping threshold behaviour | Shipping waived at threshold | ☐ |
| 12.14 | Admin login and order visibility | Admin sees the test order | ☐ |
| 12.15 | Test order cancelled and cleaned up | No test data left live | ☐ |
| 12.16 | Browser console clean | No errors on key pages | ☐ |

## 13. Rollback Plan

| Step | Action | Owner |
|---|---|---|
| R1 | Trigger criteria defined: checkout failure, data loss, auth breach, error rate > `<<5%>>`, homepage down > `<<10>>` min | |
| R2 | Decision maker on call during launch window | `<<Name>>` |
| R3 | Revert to the previous deployment in one click; verify homepage and checkout | |
| R4 | If the database is implicated, restore the pre-launch backup to a new instance first, verify, then switch | |
| R5 | Enable maintenance mode while rolling back | |
| R6 | Post a status notice on Instagram + WhatsApp within `<<15>>` minutes | |
| R7 | Pause paid ads and scheduled campaigns | |
| R8 | Hold all dispatches until the order table is verified | |
| R9 | Write the incident note: what broke, blast radius, fix, prevention | |
| R10 | Re-launch only after the failed smoke test passes twice | |

---

## Final Sign-off

| Area | Owner | Date | ☐ |
|---|---|---|---|
| Technical (domain, SSL, hosting, DB, auth) | `<<Name>>` | | ☐ |
| Catalog (products, images, pricing) | `<<Name>>` | | ☐ |
| Marketing (SEO, analytics, social) | `<<Name>>` | | ☐ |
| Operations (shipping, payments, returns, WhatsApp) | `<<Name>>` | | ☐ |
| Business owner final approval | `<<Name>>` | | ☐ |
