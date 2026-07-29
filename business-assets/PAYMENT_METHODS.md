# Elite Brands — Payment Methods

Supported at soft launch: **Cash on Delivery, Bank Transfer, Easypaisa, JazzCash**.
Planned: card / integrated online gateway.

All amounts in PKR. All order references use the format `EB-#####`.

---

## Summary Table

| Method | Status | Prepayment | Verification window | COD fee | Order status on placement |
|---|---|---|---|---|---|
| Cash on Delivery | Live | No | N/A | `<<PKR 0>>` | `confirmed` |
| Bank Transfer | Live | Yes | 24 h | — | `awaiting_payment` |
| Easypaisa | Live | Yes | 12 h | — | `awaiting_payment` |
| JazzCash | Live | Yes | 12 h | — | `awaiting_payment` |
| Card / online gateway | Planned | Yes | Instant | — | `paid` |

---

## 1. Cash on Delivery (COD)

**Customer instructions**
1. Select **Cash on Delivery** at checkout.
2. Keep the exact amount ready — riders may not carry change.
3. You may inspect the parcel exterior; opening before payment is at the courier's discretion.
4. Payment is made directly to the courier rider.

**Internal processing notes**
- Available only inside serviceable COD zones (see `SHIPPING_ZONES.md`).
- COD cap: `<<PKR 30,000>>` per order. Above the cap, require partial advance of `<<25%>>`.
- Confirm every COD order by WhatsApp/call before dispatch. Unconfirmed after `<<2>>` attempts within 24 h → mark `on_hold`.
- Repeat refusal history: 2+ refused parcels on the same phone/CNIC → COD disabled, prepayment only.
- COD remittance from courier lands in `<<3–7>>` working days; reconcile against the courier statement weekly.

---

## 2. Bank Transfer

**Customer instructions**
1. Place the order and choose **Bank Transfer**.
2. Transfer the exact total to the account shown on the confirmation screen and in your email.
3. Use your order number `EB-#####` as the payment reference.
4. Send the transfer screenshot on WhatsApp `<<+92 3XX XXXXXXX>>` or reply to your order email.
5. Orders are dispatched after payment is verified (usually within 24 hours).

**Internal processing notes**
- Order sits at `awaiting_payment`; stock is reserved for `<<24>>` hours.
- Verify amount, date/time and last 4 digits against the bank statement — never on screenshot alone.
- Partial payment → contact customer, do not dispatch until settled.
- Overpayment → refund the difference to the source account within `<<3>>` working days.
- No payment after 24 h → send reminder; after 48 h auto-cancel and release stock.
- Record: transaction ID, payer name, amount, timestamp, verifier initials.

---

## 3. Easypaisa

**Customer instructions**
1. Choose **Easypaisa** at checkout.
2. Send the exact total to `<<03XX XXXXXXX>>` (Account title: `<<ELITE BRANDS>>`) via the Easypaisa app, a retailer, or `*786#`.
3. Share the TID / transaction screenshot on WhatsApp with your order number.
4. Dispatch follows verification, usually within 12 hours.

**Internal processing notes**
- Accept app transfers, retailer deposits and wallet-to-wallet.
- Match TID against the Easypaisa merchant/statement view; TIDs are unique — never accept a reused TID.
- Retailer deposits may carry a customer-side service fee; the order total must still be received in full.
- Stock hold: `<<12>>` hours, then reminder, then auto-cancel at 36 h.

---

## 4. JazzCash

**Customer instructions**
1. Choose **JazzCash** at checkout.
2. Send the exact total to `<<03XX XXXXXXX>>` (Account title: `<<ELITE BRANDS>>`) via the JazzCash app, an agent, or `*786#`.
3. Share the TID / screenshot on WhatsApp with your order number.
4. Dispatch follows verification, usually within 12 hours.

**Internal processing notes**
- Same verification discipline as Easypaisa: unique TID, exact amount, timestamp.
- Agent-assisted deposits: confirm the sender name matches the order contact where possible.
- Stock hold: `<<12>>` hours, reminder, auto-cancel at 36 h.

---

## 5. Future Online Payments (Planned)

Scope for phase 2 — not live at soft launch.

- Candidate providers: `<<Safepay / PayFast / Stripe (intl.) / Bank direct integration>>`.
- Requirements before enabling: business bank account, NTN, verified domain with SSL, refund policy page live, settlement account confirmed.
- Expected capability: card (debit/credit), instant bank transfer, wallet checkout, auto status `paid`, automated refunds.
- Rollout plan: enable in test mode → 10 internal test orders → soft enable for 1 category → full enable.
- Once live, prepayment methods above remain available; COD rules unchanged.

---

## 6. Refunds by Method

| Original method | Refund route | Target turnaround |
|---|---|---|
| COD | Bank transfer or wallet to customer-provided account | `<<5–7>>` working days |
| Bank Transfer | Same account used for payment | `<<3–5>>` working days |
| Easypaisa | Same wallet number | `<<3–5>>` working days |
| JazzCash | Same wallet number | `<<3–5>>` working days |
| Online gateway (future) | Auto-reverse to source card | `<<7–10>>` working days |

Refund approvals and evidence requirements: see `RETURNS_PLAYBOOK.md`.

---

## 7. Fraud & Risk Controls

- Never dispatch on a screenshot alone; always confirm on the statement.
- Beware edited screenshots: check font consistency, balance line, and TID length.
- Flag orders with mismatched name/address/phone patterns for manual review.
- High-value orders above `<<PKR 50,000>>`: prepayment only, plus a verification call.
- Do not publish bank details in public captions or comments — share only in the checkout flow, order email, or a direct chat.
