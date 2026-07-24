import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tags } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmptyState } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";

export const Route = createFileRoute("/admin/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Elite Brands Admin" },
      { name: "description", content: "The maisons stocked by the boutique." },
      { property: "og:title", content: "Brands — Elite Brands Admin" },
      { property: "og:description", content: "Manage the maisons of Elite Brands." },
    ],
  }),
  component: BrandsPage,
});

const brands = [
  { name: "Maison Noir", initials: "MN", products: 128, since: "2019" },
  { name: "Rive Blanche", initials: "RB", products: 96, since: "2020" },
  { name: "Aurum", initials: "AU", products: 74, since: "2021" },
  { name: "Ciel & Or", initials: "CO", products: 42, since: "2023" },
  { name: "Studio Palma", initials: "SP", products: 38, since: "2024" },
  { name: "Atelier Verre", initials: "AV", products: 22, since: "2025" },
];

function BrandsPage() {
  return (
    <AdminLayout
      eyebrow="Catalogue"
      title="Brands"
      description="The maisons that compose the boutique."
      actions={
        <Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
          <Plus className="mr-1 h-4 w-4" /> Add brand
        </Button>
      }
    >
      {brands.length === 0 ? (
        <EmptyState icon={Tags} title="No brands yet" description="Introduce the first maison to the boutique." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <Card key={b.name} className="border-border/60 bg-card shadow-luxe">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-gold font-serif text-lg text-gold-foreground shadow-luxe">
                  {b.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg text-foreground">{b.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Since {b.since}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.products} products</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
