import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/layout/app-shell";
import { Container } from "@/common/container";
import { PageHeader } from "@/common/page-header";
import { ProductImage } from "@/product/product-image";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: buildMeta({ title: "Cart", description: "Your shopping bag.", path: "/cart" }),
    links: canonical("/cart"),
  }),
  component: CartPage,
});

function CartPage() {
  const { detailedItems, subtotal, update, remove } = useCart();
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  if (detailedItems.length === 0) {
    return (
      <AppShell>
        <PageHeader eyebrow="Bag" title="Your Cart is Empty" description="Browse our premium outlet and add your first article." />
        <Container className="py-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Bag" title="Your Cart" />
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {detailedItems.map(({ product, quantity, lineTotal }) => (
              <div
                key={product.id}
                className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-lg border border-border bg-card p-4 shadow-elite-sm sm:grid-cols-[120px_1fr_auto]"
              >
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  <ProductImage hue={product.colorHue} label={product.brand} aspect="aspect-[3/4]" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {product.brand}
                  </p>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="mt-1 block text-sm font-medium text-foreground hover:text-primary sm:text-base"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{product.categoryLabel}</p>

                  <div className="mt-3 inline-flex items-center rounded-md border border-input">
                    <button
                      type="button"
                      onClick={() => update(product.id, quantity - 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-accent"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => update(product.id, quantity + 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-accent"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="text-sm font-semibold text-foreground">{formatPrice(lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-border bg-surface p-6 shadow-elite-sm lg:sticky lg:top-24">
            <p className="eyebrow">Order Summary</p>
            <span className="gold-rule mt-3" />
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-foreground">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium text-foreground">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-semibold text-foreground">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-accent"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </Container>
    </AppShell>
  );
}
