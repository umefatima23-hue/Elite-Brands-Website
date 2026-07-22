import { Link } from "@tanstack/react-router";
import { Container } from "@/common/container";
import { BRANDS } from "@/data/products";

export function FeaturedBrands() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow">The Houses</p>
          <h2 className="mt-2 text-3xl md:text-4xl text-foreground">Featured Brands</h2>
          <span className="gold-rule mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              to="/shop"
              search={{ brand: b.slug }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 text-center shadow-elite-sm transition-shadow hover:shadow-elite"
            >
              <div
                className="mx-auto mb-3 h-16 w-16 rounded-full"
                style={{
                  backgroundImage: `linear-gradient(135deg, oklch(0.9 0.06 ${b.hue}), oklch(0.55 0.12 ${b.hue + 30}))`,
                }}
                aria-hidden
              />
              <p className="font-display text-base text-foreground group-hover:text-primary">
                {b.name}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {b.tagline}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
