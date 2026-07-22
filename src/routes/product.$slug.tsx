import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/common/container";
import { ProductImage } from "@/components/product/product-image";
import { ProductGrid } from "@/components/product/product-grid";
import { getProductBySlug, getRelated } from "@/data/products";
import { discountPercent, formatPrice, savedAmount } from "@/lib/format";
import { whatsappProductMessage, whatsappUrl } from "@/lib/whatsapp";
import { useCart } from "@/stores/cart";
import { buildMeta, canonical } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: buildMeta({
        title: `${product.name} — ${product.brand}`,
        description: `${product.brand} ${product.name}. ${product.description}`,
        path: `/product/${params.slug}`,
        type: "product",
      }),
      links: canonical(`/product/${params.slug}`),
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [imgIdx, setImgIdx] = useState(0);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const related = getRelated(product);
  const discount = discountPercent(product.originalPrice, product.salePrice);
  const saved = savedAmount(product.originalPrice, product.salePrice);

  return (
    <AppShell>
      <Container className="py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <ProductImage hue={product.colorHue + imgIdx * 30} label={product.brand} aspect="aspect-[4/5]" />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.map((img: string, i: number) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    "overflow-hidden rounded-md border transition-colors",
                    imgIdx === i ? "border-gold" : "border-border hover:border-primary/40",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage hue={product.colorHue + i * 30} label={`${i + 1}`} aspect="aspect-square" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-2 text-3xl md:text-4xl text-foreground">{product.name}</h1>
            <span className="gold-rule mt-4" />

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-foreground">{formatPrice(product.salePrice)}</span>
              {product.originalPrice > product.salePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded-sm bg-destructive px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-destructive-foreground">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            {saved > 0 && (
              <p className="mt-1 text-sm font-medium text-gold">You save {formatPrice(saved)}</p>
            )}

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  product.inStock
                    ? "bg-whatsapp/10 text-whatsapp"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                <Check className="h-3 w-3" aria-hidden /> {product.inStock ? "In stock — ready to ship" : "Out of stock"}
              </span>
            </div>

            {/* Fabric + Included */}
            <div className="mt-7 grid gap-5 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Fabric</p>
                <p className="text-sm text-foreground">{product.fabric}</p>
                <p className="mt-1 text-xs text-muted-foreground">Category: {product.categoryLabel}</p>
              </div>
              <div>
                <p className="eyebrow mb-2">What's Included</p>
                <ul className="space-y-1 text-sm text-foreground">
                  {product.included.map((it: string) => (
                    <li key={it} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-gold" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity + CTAs */}
            <div className="mt-7 flex items-center gap-3">
              <div className="inline-flex items-center rounded-md border border-input">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 text-lg hover:bg-accent"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-10 w-10 text-lg hover:bg-accent"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  add(product.id, qty);
                  toast.success(`${product.name} added to cart`);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
              <Link
                to="/checkout"
                onClick={() => add(product.id, qty)}
                className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
              >
                Buy Now
              </Link>
            </div>

            <a
              href={whatsappUrl(whatsappProductMessage(product.name, product.brand, `/product/${product.slug}`))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-whatsapp px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-whatsapp-foreground hover:opacity-95"
            >
              Order on WhatsApp
            </a>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-gold" />
              Nationwide delivery • Cash on Delivery available
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-20">
          <div className="mb-8 text-center">
            <p className="eyebrow">You may also love</p>
            <h2 className="mt-2 text-2xl md:text-3xl text-foreground">Related Products</h2>
            <span className="gold-rule mx-auto mt-4" />
          </div>
          <ProductGrid products={related} />
        </section>
      </Container>
    </AppShell>
  );
}
