import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { ProductGrid } from "@/product/product-grid";
import { discountPercent } from "@/lib/format";
import { listProducts } from "@/lib/catalog";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/deals")({
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: buildMeta({
      title: "Deals",
      description: "Biggest discounts on premium lawn.",
      path: "/deals",
    }),
    links: canonical("/deals"),
  }),
  component: DealsPage,
});

function DealsPage() {
  const { products } = Route.useLoaderData();
  return (
    <AppShell>
      <PageHeader eyebrow="Best value" title="Deals" description="Ranked by biggest saving." />
      <Container className="py-10">
        <ProductGrid
          products={[...products].sort(
            (a, b) =>
              discountPercent(b.originalPrice, b.salePrice) -
              discountPercent(a.originalPrice, a.salePrice),
          )}
        />
      </Container>
    </AppShell>
  );
}
