import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: buildMeta({ title: "Collections", description: "Shop by collection.", path: "/collections" }),
    links: canonical("/collections"),
  }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Curated" title="Collections" />
      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c.slug).length;
            const hue = 30 + i * 60;
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-elite-sm hover:shadow-elite"
              >
                <div
                  className="aspect-[4/5]"
                  style={{
                    backgroundImage: `linear-gradient(160deg, oklch(0.92 0.06 ${hue}), oklch(0.6 0.12 ${hue + 40}))`,
                  }}
                />
                <div className="p-5">
                  <p className="font-display text-xl text-foreground group-hover:text-primary">{c.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{count} pieces</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </AppShell>
  ),
});
