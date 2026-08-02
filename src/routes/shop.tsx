import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { ProductGrid } from "@/product/product-grid";
import { ShopFilters, DEFAULT_FILTERS, type ShopFilterState } from "@/shop/shop-filters";
import { listProducts } from "@/lib/catalog";
import { discountPercent } from "@/lib/format";
import { buildMeta, canonical } from "@/lib/seo";

const searchSchema = z.object({
  brand: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  loader: async () => ({ products: await listProducts() }),
  head: () => ({
    meta: buildMeta({
      title: "Shop",
      description:
        "Browse Pakistani unstitched printed lawn from Sana Safinaz, Gul Ahmed, Khaadi and more.",
      path: "/shop",
    }),
    links: canonical("/shop"),
  }),
  component: ShopPage,
});

function ShopPage() {
  const { products } = Route.useLoaderData();
  const search = Route.useSearch();
  const [filters, setFilters] = useState<ShopFilterState>({
    ...DEFAULT_FILTERS,
    brand: search.brand ?? "all",
    category: search.category ?? "all",
    q: search.q ?? "",
  });

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.brand !== "all") list = list.filter((p) => p.brandSlug === filters.brand);
    if (filters.category !== "all") list = list.filter((p) => p.category === filters.category);
    if (filters.q.trim()) {
      const q = filters.q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q),
      );
    }
    if (filters.price !== "all") {
      list = list.filter((p) => {
        if (filters.price === "0-5000") return p.salePrice < 5000;
        if (filters.price === "5000-10000") return p.salePrice >= 5000 && p.salePrice <= 10000;
        if (filters.price === "10000+") return p.salePrice > 10000;
        return true;
      });
    }
    if (filters.sort === "price-asc") list.sort((a, b) => a.salePrice - b.salePrice);
    else if (filters.sort === "price-desc") list.sort((a, b) => b.salePrice - a.salePrice);
    else if (filters.sort === "discount")
      list.sort(
        (a, b) =>
          discountPercent(b.originalPrice, b.salePrice) -
          discountPercent(a.originalPrice, a.salePrice),
      );
    return list;
  }, [products, filters]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Catalogue"
        title="Shop"
        description="Filter by brand, category, and price. Every article is 100% original."
      />
      <Container className="py-10">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <ShopFilters value={filters} onChange={setFilters} resultCount={filtered.length} />
          </aside>
          <div>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </Container>
    </AppShell>
  );
}
