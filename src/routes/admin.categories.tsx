import { createFileRoute } from "@tanstack/react-router";
import { Plus, FolderTree, MoreHorizontal } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionCard, EmptyState } from "@/components/admin/ui";
import { Button } from "@/ui/button";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Elite Brands Admin" },
      { name: "description", content: "Organise the boutique into refined categories." },
      { property: "og:title", content: "Categories — Elite Brands Admin" },
      { property: "og:description", content: "Curate the taxonomy of the boutique." },
    ],
  }),
  component: CategoriesPage,
});

const categories = [
  { name: "Outerwear", products: 84, children: ["Trenches", "Coats", "Blazers"] },
  { name: "Tailoring", products: 62, children: ["Suits", "Shirts", "Trousers"] },
  { name: "Accessories", products: 128, children: ["Leather", "Silk", "Jewellery"] },
  { name: "Footwear", products: 48, children: ["Loafers", "Boots", "Heels"] },
];

function CategoriesPage() {
  return (
    <AdminLayout
      eyebrow="Catalogue"
      title="Categories"
      description="How the boutique is organised for discovery."
      actions={
        <Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
          <Plus className="mr-1 h-4 w-4" /> New category
        </Button>
      }
    >
      {categories.length === 0 ? (
        <EmptyState icon={FolderTree} title="No categories yet" description="Create a category to begin organising pieces." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((c) => (
            <SectionCard
              key={c.name}
              title={c.name}
              description={`${c.products} products`}
              action={
                <Button variant="ghost" size="icon" aria-label={`Manage ${c.name}`}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            >
              <ul className="grid gap-2">
                {c.children.map((s) => (
                  <li
                    key={s}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{s}</span>
                    <span className="text-xs text-muted-foreground">— products</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
