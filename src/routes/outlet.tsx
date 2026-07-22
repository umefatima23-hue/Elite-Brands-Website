import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { ProductGrid } from "@/product/product-grid";
import { PRODUCTS } from "@/data/products";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/outlet")({
  head: () => ({
    meta: buildMeta({
      title: "Premium Outlet",
      description: "Save up to 60% on original Pakistani unstitched lawn at the Elite Brands premium outlet.",
      path: "/outlet",
    }),
    links: canonical("/outlet"),
  }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Save up to 60%" title="Premium Outlet" description="Season hits and leftover collections from top design houses — at a fraction." />
      <Container className="py-10">
        <ProductGrid products={PRODUCTS.filter((p) => p.isOutlet)} />
      </Container>
    </AppShell>
  ),
});
