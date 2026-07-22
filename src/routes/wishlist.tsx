import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Container } from "@/components/common/container";
import { ProductGrid } from "@/components/product/product-grid";
import { PRODUCTS } from "@/data/products";
import { useWishlist } from "@/stores/wishlist";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: buildMeta({ title: "Wishlist", description: "Your saved articles.", path: "/wishlist" }),
    links: canonical("/wishlist"),
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <AppShell>
      <PageHeader eyebrow="Your favourites" title="Wishlist" />
      <Container className="py-10">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center">
            <Heart className="mx-auto mb-4 h-8 w-8 text-gold" />
            <p className="text-sm text-muted-foreground">Your wishlist is empty. Tap the heart on any product to save it here.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90">
              Explore Shop
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </Container>
    </AppShell>
  );
}
