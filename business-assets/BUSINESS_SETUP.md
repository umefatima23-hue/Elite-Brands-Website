# Elite Brands — Business Setup Checklist

Fill every `<< >>` placeholder before go-live. Keep this file as the single source of truth for business identity data used across the storefront, invoices, emails and WhatsApp.

---

## 1. Company Details

| Field | Value | Status |
|---|---|---|
| Registered business name | `<<Elite Brands (Pvt) Ltd / Sole Proprietor>>` | ☐ |
| Trading / brand name | Elite Brands | ☑ |
| Business type | `<<Sole Proprietorship / Partnership / Pvt Ltd>>` | ☐ |
| Registration / incorporation no. | `<<REG-000000>>` | ☐ |
| Date established | `<<DD-MM-YYYY>>` | ☐ |
| Registered address | `<<Street, Area, City, Postal Code, Pakistan>>` | ☐ |
| Warehouse / dispatch address | `<<Street, Area, City, Postal Code>>` | ☐ |
| Business hours | `<<Mon–Sat, 10:00–19:00 PKT>>` | ☐ |
| Primary market | Pakistan (nationwide) | ☑ |
| Secondary market (phase 2) | `<<UAE / UK / USA>>` | ☐ |

---

## 2. Contact Information

| Channel | Value | Public? | Status |
|---|---|---|---|
| Support phone | `<<+92 3XX XXXXXXX>>` | Yes | ☐ |
| Landline (optional) | `<<+92 XX XXXXXXX>>` | Yes | ☐ |
| Support email | `<<support@elitebrands.pk>>` | Yes | ☐ |
| Orders email | `<<orders@elitebrands.pk>>` | Yes | ☐ |
| Returns email | `<<returns@elitebrands.pk>>` | Yes | ☐ |
| Press / collab email | `<<hello@elitebrands.pk>>` | Yes | ☐ |
| Internal admin email | `<<admin@elitebrands.pk>>` | No | ☐ |
| Escalation contact | `<<Name — +92 3XX XXXXXXX>>` | No | ☐ |

**Response SLAs**
- WhatsApp: within 2 working hours
- Email: within 24 working hours
- Social DMs: within 12 working hours

---

## 3. WhatsApp Business

| Field | Value | Status |
|---|---|---|
| WhatsApp Business number | `<<+92 3XX XXXXXXX>>` | ☐ |
| Display name | Elite Brands | ☐ |
| Profile category | Apparel & Clothing | ☐ |
| Profile photo | Gold monogram on obsidian | ☐ |
| About text | `Premium Pakistani designer wear. Nationwide delivery.` | ☐ |
| Catalog enabled | Yes / No | ☐ |
| Greeting message set | Yes / No | ☐ |
| Away message set | Yes / No | ☐ |
| Quick replies loaded | From `launch-content/whatsapp-templates.md` | ☐ |
| Click-to-chat link | `https://wa.me/92XXXXXXXXXX` | ☐ |
| Support hours shown | `<<Mon–Sat, 10:00–19:00 PKT>>` | ☐ |

---

## 4. Email Infrastructure

| Item | Value | Status |
|---|---|---|
| Domain | `<<elitebrands.pk>>` | ☐ |
| Mailbox provider | `<<Google Workspace / Zoho Mail>>` | ☐ |
| Transactional sender | `<<no-reply@elitebrands.pk>>` | ☐ |
| Sender display name | Elite Brands | ☐ |
| SPF record | ☐ configured |
| DKIM record | ☐ configured |
| DMARC record | ☐ configured |
| Reply-to routing | → support inbox | ☐ |

---

## 5. Social Media

| Platform | Handle | URL | Status |
|---|---|---|---|
| Instagram | `<<@elitebrands.pk>>` | `<<https://instagram.com/...>>` | ☐ |
| Facebook | `<<Elite Brands>>` | `<<https://facebook.com/...>>` | ☐ |
| TikTok | `<<@elitebrands.pk>>` | `<<https://tiktok.com/@...>>` | ☐ |
| Pinterest | `<<elitebrandspk>>` | `<<https://pinterest.com/...>>` | ☐ |
| YouTube (optional) | `<<Elite Brands>>` | `<<...>>` | ☐ |
| Threads (optional) | `<<@elitebrands.pk>>` | `<<...>>` | ☐ |

Consistency rules:
- Same handle across all platforms where available.
- Same avatar (gold monogram), same bio first line.
- Bio link points to homepage, not a link-in-bio tool, unless running multi-campaign.

---

## 6. Bank Details (Placeholders)

> Never commit real account numbers to a public repository. Store final values in the admin panel or a secrets manager.

**Primary business account**

| Field | Value |
|---|---|
| Account title | `<<ELITE BRANDS>>` |
| Bank name | `<<Bank Name>>` |
| Branch | `<<Branch Name / Code>>` |
| Account number | `<<0000-0000000000>>` |
| IBAN | `<<PK00XXXX0000000000000000>>` |
| Currency | PKR |
| Swift (if intl.) | `<<XXXXPKKA>>` |

**Mobile wallets**

| Wallet | Account title | Number |
|---|---|---|
| Easypaisa | `<<ELITE BRANDS>>` | `<<03XX XXXXXXX>>` |
| JazzCash | `<<ELITE BRANDS>>` | `<<03XX XXXXXXX>>` |

**Payout / reconciliation**
- Reconciliation day: `<<every Monday>>`
- Responsible person: `<<Name>>`
- Proof-of-payment archive: `<<Drive folder / admin uploads>>`

---

## 7. Tax Fields (Placeholders)

| Field | Value | Status |
|---|---|---|
| NTN (National Tax Number) | `<<0000000-0>>` | ☐ |
| STRN (Sales Tax Reg. No.) | `<<00-00-0000-000-00>>` | ☐ |
| Provincial revenue authority | `<<PRA / SRB / KPRA / BRA>>` | ☐ |
| Filer status | `<<Filer / Non-filer>>` | ☐ |
| Sales tax applicable | `<<Yes / No>>` | ☐ |
| Default tax rate | `<<0% at soft launch>>` | ☐ |
| Tax shown on invoice | `<<Inclusive / Exclusive / N/A>>` | ☐ |
| Invoice prefix | `<<EB-INV->>` | ☐ |
| Invoice numbering start | `<<1001>>` | ☐ |
| Tax consultant contact | `<<Name — phone — email>>` | ☐ |

---

## 8. Sign-off

| Item | Owner | Date | ☐ |
|---|---|---|---|
| Company details verified | `<<Name>>` | | ☐ |
| Contact channels live and tested | `<<Name>>` | | ☐ |
| WhatsApp Business configured | `<<Name>>` | | ☐ |
| Bank + wallet accounts verified with test transfer | `<<Name>>` | | ☐ |
| Tax fields confirmed by consultant | `<<Name>>` | | ☐ |
| Social profiles published | `<<Name>>` | | ☐ |
