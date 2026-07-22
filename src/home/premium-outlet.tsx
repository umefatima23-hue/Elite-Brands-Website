import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container } from "@/common/container";
import { ProductGrid } from "@/product/product-grid";
import { PRODUCTS } from "@/data/products";

export function PremiumOutlet() {
  const items = PRODUCTS.filter((p) => p.isOutlet).slice(0, 4);
  return (
    <section
      aria-labelledby="premium-outlet-heading"
      className="relative border-b border-border bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.085_78/0.15),transparent_70%)]"
      />
      <Container className="relative py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold">Save up to 60%</p>
            <h2
              id="premium-outlet-heading"
              className="mt-2 text-3xl md:text-4xl text-foreground"
            >
              Premium Outlet
            </h2>
            <span className="gold-rule mt-4" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              End-of-season luxury lawn from the houses you already love — while stocks last.
            </p>
          </div>
          <Link
            to="/outlet"
            className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline sm:self-end"
          >
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <ProductGrid products={items} />
      </Container>
    </section>
  );
}
