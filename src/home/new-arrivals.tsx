import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container } from "@/common/container";
import { ProductGrid } from "@/product/product-grid";
import { PRODUCTS } from "@/data/products";

export function NewArrivals() {
  const items = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  return (
    <section aria-labelledby="new-arrivals-heading" className="border-b border-border bg-surface">
      <Container className="py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Fresh off the season</p>
            <h2 id="new-arrivals-heading" className="mt-2 text-3xl md:text-4xl text-foreground">
              New Arrivals
            </h2>
            <span className="gold-rule mt-4" />
          </div>
          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline sm:self-end"
          >
            Shop all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <ProductGrid products={items} />
      </Container>
    </section>
  );
}
