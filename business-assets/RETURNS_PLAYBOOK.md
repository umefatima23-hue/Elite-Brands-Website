# Elite Brands — Returns Playbook (Internal)

Audience: support and operations team. Customer-facing wording lives in `marketing-assets/return-policy.md`; this document is the internal workflow.

Windows (placeholders): return request within `<<7>>` days of delivery; parcel must reach us within `<<14>>` days of delivery.

---

## 1. Eligibility Matrix

| Case | Eligible | Route |
|---|---|---|
| Wrong item sent | Yes | Free return + reship, our cost |
| Damaged / defective on arrival | Yes | Free return, replace or refund |
| Size issue (stitched/pret) | Yes | Exchange preferred |
| Changed mind, unused, tags intact | Yes | Return for store credit or refund |
| Unstitched fabric, cut or washed | No | Reject, explain politely |
| Custom / made-to-measure | No | Reject unless our error |
| Sale item at ≥`<<50%>>` off | Exchange only | No cash refund |
| Innerwear, jewellery, accessories | No | Hygiene exclusion |
| Missing tags / worn / perfumed | No | Reject with photo evidence |
| Late request (>7 days) | Discretionary | Supervisor approval |

---

## 2. Standard Return Workflow

1. **Intake** — customer contacts via WhatsApp, email or the account page. Capture: order number, item(s), reason code, photos.
2. **Triage** — check eligibility matrix. Respond within `<<2>>` working hours.
3. **Authorise** — issue an RMA reference `RMA-#####`, link it to the order, set order status `return_requested`.
4. **Collect** — arrange reverse pickup with `<<Courier A>>` or ask the customer to ship to the returns address. Share packing instructions.
5. **Receive** — log arrival date, condition, and photos on the same day.
6. **Inspect** — QC within `<<2>>` working days against the checklist in section 6.
7. **Resolve** — approve refund, exchange, or rejection. Notify the customer the same day.
8. **Close** — restock or write off, update inventory, mark the RMA closed.

Target end-to-end: `<<7>>` working days from pickup to resolution.

---

## 3. Exchange Workflow

1. Confirm the replacement size/colour is in stock **before** authorising.
2. Reserve the replacement unit against the RMA immediately.
3. For prepaid customers: dispatch the replacement after the return is received and passes QC.
4. For high-trust customers (`<<3+>>` clean orders): cross-ship allowed with supervisor approval.
5. Price differences: customer pays the difference for an upgrade; we refund the difference for a downgrade.
6. One exchange per order line. A second issue on the same line becomes a refund case.
7. Exchange shipping: free when the fault is ours, `<<PKR 199>>` when it is a size/preference change.

---

## 4. Damaged / Defective Items

**Definition:** stains, tears, broken stitching, colour bleed, missing components, print defects, courier crush damage.

Workflow:
1. Request photos within `<<48>>` hours of delivery: full garment, close-up of defect, packaging, and the shipping label.
2. Do not ask the customer to return the item before triage — approve first, ship second.
3. Categorise: **supplier defect**, **warehouse/packing error**, or **courier damage**.
4. Resolution priority: replacement → full refund → store credit + goodwill discount.
5. Never charge return shipping on a confirmed defect.
6. Log every defect against the SKU and supplier. Any SKU with `<<3>>` defects in 30 days is delisted pending review.
7. Courier damage: file a claim with the courier within their window (`<<7>>` days) and attach the photo set.

---

## 5. Refunds

| Step | Rule |
|---|---|
| Approval | Support agent up to `<<PKR 10,000>>`; supervisor above |
| Trigger | Only after QC pass, or immediately for our confirmed error |
| Amount | Amount actually paid for the item, plus original shipping if the whole order is returned due to our error |
| Deductions | Return shipping on change-of-mind returns (`<<PKR 199>>`) |
| Method | Back to the original payment route — see `PAYMENT_METHODS.md` §6 |
| COD refunds | Bank/wallet transfer to a customer-provided account; verify title before sending |
| Turnaround | Initiate within `<<2>>` working days of QC pass |
| Evidence | Store the transfer receipt against the RMA |
| Partial returns | Recalculate discounts proportionally; never refund more than paid |
| Store credit alternative | Offer `<<+10%>>` bonus value to encourage credit over cash |

---

## 6. QC Inspection Checklist

- [ ] All items listed on the RMA are present
- [ ] Original tags attached and unbroken
- [ ] No wear, stains, odour, perfume, or makeup marks
- [ ] Unstitched fabric uncut, unwashed, folded as sent
- [ ] Accessories, dupatta, buttons, packaging inserts present
- [ ] Reported defect verified and photographed
- [ ] Condition graded: **A** resellable / **B** discountable / **C** write-off
- [ ] Inventory updated to match the grade
- [ ] Photos and notes attached to the RMA record

---

## 7. Customer Communication

Tone: calm, warm, precise. Acknowledge first, then explain, then state the next step and its timeline. Never argue, never blame the customer, never leave a case silent for more than 24 hours.

**Acknowledgement**
> Thank you for letting us know about order `EB-#####`. I'm sorry this wasn't right. I've opened return reference `RMA-#####` and will confirm the next step within 2 working hours.

**Approved return**
> Your return for `EB-#####` is approved. Our courier will collect from your address within 2 working days. Please keep the item with tags attached and in its original packing.

**Exchange confirmed**
> Your exchange is confirmed — `<<size/colour>>` is reserved for you. We'll dispatch as soon as the original item reaches us, and share tracking on WhatsApp.

**Refund issued**
> Your refund of PKR `<<amount>>` for order `EB-#####` has been sent to `<<method>>`. It should reflect within `<<3–5>>` working days. The transfer receipt is attached.

**Declined (with care)**
> I've reviewed your request for `EB-#####`. Unfortunately this item falls outside our returns policy because `<<reason>>`. I'd still like to help — I can offer `<<store credit / discount on your next order>>`. Would that work for you?

**Delay update**
> A quick update on `RMA-#####`: inspection is taking a little longer than expected. I'll have a final answer for you by `<<date>>`. Thank you for your patience.

---

## 8. Escalation

| Trigger | Escalate to | Window |
|---|---|---|
| Refund above `<<PKR 25,000>>` | `<<Owner>>` | Same day |
| Customer threatens public complaint | Supervisor | Within 1 hour |
| Repeat return abuse (`<<3+>>` returns in 60 days) | Supervisor | Before authorising |
| Courier dispute / lost parcel | Ops lead | Within 24 hours |
| Legal or consumer-court notice | `<<Owner>>` | Immediately |

---

## 9. Metrics

Review monthly:
- Return rate overall and by category (flag any category above `<<12%>>`)
- Top 5 return reason codes
- Average resolution time (target `<<7>>` working days)
- Defect rate by supplier
- Refund vs exchange vs store-credit split
- Resale grade mix (target: `<<80%>>` grade A)
