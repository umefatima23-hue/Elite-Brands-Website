import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/layout/app-shell";
import { Container } from "@/common/container";
import { PageHeader } from "@/common/page-header";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      ...buildMeta({ title: "Checkout", description: "Secure checkout.", path: "/checkout" }),
      { name: "robots", content: "noindex" },
    ],
    links: canonical("/checkout"),
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailedItems, subtotal, clear } = useCart();
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (detailedItems.length === 0) {
    return (
      <AppShell>
        <PageHeader eyebrow="Secure" title="Checkout" description="Your cart is empty." />
        <Container className="py-10 text-center">
          <Link to="/shop" className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90">
            Browse Products
          </Link>
        </Container>
      </AppShell>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");

    // Placeholder: order confirmation via WhatsApp (backend hook coming later)
    setTimeout(() => {
      toast.success("Order placed! We'll confirm shortly via WhatsApp.");
      const msg = `New Order from ${name} (${phone}) — Total ${formatPrice(total)}. Items: ${detailedItems.map((i) => `${i.product.name} x${i.quantity}`).join(", ")}`;
      window.open(whatsappUrl(msg), "_blank");
      clear();
      navigate({ to: "/" });
    }, 700);
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Secure" title="Checkout" />
      <Container className="py-10">
        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Section title="Customer Information">
              <Field name="name" label="Full Name" required />
              <Field name="email" label="Email" type="email" />
              <Field name="phone" label="Phone (WhatsApp)" required placeholder="+92 3xx xxxxxxx" />
            </Section>

            <Section title="Shipping Address">
              <Field name="address" label="Street Address" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="city" label="City" required />
                <Field name="postal" label="Postal Code" />
              </div>
              <Field name="notes" label="Order Notes (optional)" />
            </Section>

            <Section title="Payment Method">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-primary/40 bg-surface p-4">
                <input type="radio" name="payment" defaultChecked className="mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Cash on Delivery</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pay in cash when your order arrives at your doorstep. Available nationwide.
                  </p>
                </div>
              </label>
              <p className="rounded-md border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
                Order confirmation is sent via WhatsApp. Card & bank transfer options arrive in the next release.
              </p>
            </Section>
          </div>

          <aside className="h-fit rounded-lg border border-border bg-surface p-6 shadow-elite-sm lg:sticky lg:top-24">
            <p className="eyebrow">Order Summary</p>
            <span className="gold-rule mt-3" />
            <ul className="mt-5 space-y-3 text-sm">
              {detailedItems.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="min-w-0 flex-1 text-foreground">
                    <span className="line-clamp-1">{product.name}</span>
                    <span className="text-xs text-muted-foreground">Qty {quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-foreground">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-semibold text-foreground">{formatPrice(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place Order"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              By placing your order, you agree to our terms & privacy policy.
            </p>
          </aside>
        </form>
      </Container>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-elite-sm">
      <h2 className="mb-5 text-lg font-medium text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-1.5 block text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}
