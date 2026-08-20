import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "./product-image";
import type { Product } from "@/data/products";
import { discountPercent, formatPrice, savedAmount } from "@/lib/format";
import { whatsappProductMessage, whatsappUrl } from "@/lib/whatsapp";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const discount = discountPercent(product.originalPrice, product.salePrice);
  const saved = savedAmount(product.originalPrice, product.salePrice);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-elite-sm transition-shadow hover:shadow-elite">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block"
        aria-label={product.name}
      >
        <ProductImage hue={product.colorHue} label={product.brand} />

        {product.isOutlet && (
          <span className="absolute left-2.5 top-2.5 rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Premium Outlet
          </span>
        )}
        {product.isNew && !product.isOutlet && (
          <span className="absolute left-2.5 top-2.5 rounded-sm bg-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-foreground">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-sm bg-destructive px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive-foreground">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {product.brand}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-1 text-base font-medium text-foreground line-clamp-1 hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(product.salePrice)}
          </span>
          {product.originalPrice > product.salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {saved > 0 && (
          <p className="mt-0.5 text-[11px] font-medium text-gold">Save {formatPrice(saved)}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} added to cart`);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground hover:bg-accent"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
          <Link
            to="/checkout"
            onClick={() => add(product.id)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
          >
            Buy now
          </Link>
        </div>
        <a
          href={whatsappUrl(
            whatsappProductMessage(product.name, product.brand, `/product/${product.slug}`),
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-whatsapp/40 bg-whatsapp/5 px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-whatsapp hover:bg-whatsapp/10"
        >
          Order on WhatsApp
        </a>
      </div>
    </article>
  );
}
