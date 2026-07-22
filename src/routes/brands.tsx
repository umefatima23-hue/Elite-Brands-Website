import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Container } from "@/components/common/container";
import { BRANDS, PRODUCTS } from "@/data/products";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: buildMeta({ title: "Brands", description: "Shop by brand at Elite Brands.", path: "/brands" }),
    links: canonical("/brands"),
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="The houses" title="Our Brands" description="The most coveted names in Pakistani lawn — under one roof." />
      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {BRANDS.map((b) => {
            const count = PRODUCTS.filter((p) => p.brandSlug === b.slug).length;
            return (
              <Link
                key={b.slug}
                to="/shop"
                search={{ brand: b.slug }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-elite-sm transition-shadow hover:shadow-elite"
              >
                <div
                  className="aspect-[16/9]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, oklch(0.92 0.06 ${b.hue}), oklch(0.55 0.12 ${b.hue + 30}))`,
                  }}
                />
                <div className="p-5">
                  <p className="font-display text-2xl text-foreground group-hover:text-primary">{b.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{b.tagline}</p>
                  <p className="mt-3 text-sm text-gold">{count} article{count === 1 ? "" : "s"} in stock →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </AppShell>
  );
}
