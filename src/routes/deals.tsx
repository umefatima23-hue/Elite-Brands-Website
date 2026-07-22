import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Container } from "@/components/common/container";
import { ProductGrid } from "@/components/product/product-grid";
import { discountPercent } from "@/lib/format";
import { PRODUCTS } from "@/data/products";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: buildMeta({ title: "Deals", description: "Biggest discounts on premium lawn.", path: "/deals" }),
    links: canonical("/deals"),
  }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Best value" title="Deals" description="Ranked by biggest saving." />
      <Container className="py-10">
        <ProductGrid
          products={[...PRODUCTS].sort(
            (a, b) => discountPercent(b.originalPrice, b.salePrice) - discountPercent(a.originalPrice, a.salePrice),
          )}
        />
      </Container>
    </AppShell>
  ),
});
