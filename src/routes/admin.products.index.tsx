import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmptyState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({
    meta: [
      { title: "Products — Elite Brands Admin" },
      { name: "description", content: "Manage the Elite Brands product catalogue." },
      { property: "og:title", content: "Products — Elite Brands Admin" },
      { property: "og:description", content: "Curate, edit and publish luxury pieces." },
    ],
  }),
  component: ProductsPage,
});

const products = [
  { id: "P-1001", name: "Obsidian Silk Trench", brand: "Maison Noir", price: "€1,890", stock: 12, status: "published" as const },
  { id: "P-1002", name: "Ivory Cashmere Coat", brand: "Rive Blanche", price: "€2,340", stock: 3, status: "low" as const },
  { id: "P-1003", name: "Gilded Leather Loafers", brand: "Aurum", price: "€780", stock: 24, status: "published" as const },
  { id: "P-1004", name: "Onyx Tuxedo Jacket", brand: "Maison Noir", price: "€3,120", stock: 0, status: "draft" as const },
  { id: "P-1005", name: "Champagne Silk Slip", brand: "Rive Blanche", price: "€640", stock: 18, status: "published" as const },
  { id: "P-1006", name: "Vintage Gold Cufflinks", brand: "Aurum", price: "€420", stock: 40, status: "published" as const },
];

function ProductsPage() {
  return (
    <AdminLayout
      eyebrow="Catalogue"
      title="Products"
      description="Curate every piece that appears in the boutique."
      actions={
        <>
          <Button variant="outline" className="border-foreground/20 hover:border-gold hover:text-gold-deep">
            Import
          </Button>
          <Button asChild className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
            <Link to="/admin/products/new">
              <Plus className="mr-1 h-4 w-4" /> New product
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-luxe">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, brand…"
            className="h-10 rounded-full border-border bg-secondary pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[150px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="brand-all">
          <SelectTrigger className="h-10 w-[160px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brand-all">All brands</SelectItem>
            <SelectItem value="noir">Maison Noir</SelectItem>
            <SelectItem value="rive">Rive Blanche</SelectItem>
            <SelectItem value="aurum">Aurum</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-10 rounded-full border-border">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
        <Button variant="outline" className="h-10 rounded-full border-border">
          <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add your first piece to begin curating the boutique."
            action={
              <Button asChild className="bg-gradient-gold text-gold-foreground shadow-luxe">
                <Link to="/admin/products/new">
                  <Plus className="mr-1 h-4 w-4" /> New product
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-luxe">
          <div className="hidden grid-cols-[auto_2.4fr_1fr_0.8fr_0.8fr_0.9fr_auto] items-center gap-4 border-b border-border bg-secondary/60 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid">
            <Checkbox aria-label="Select all" />
            <span>Product</span>
            <span>Brand</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span className="sr-only">Actions</span>
          </div>
          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border px-4 py-4 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[auto_2.4fr_1fr_0.8fr_0.8fr_0.9fr_auto]"
            >
              <Checkbox aria-label={`Select ${p.name}`} />
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-secondary to-gold-soft/40 ring-1 ring-border">
                  <span className="font-serif text-sm text-muted-foreground">EB</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{p.name}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                    {p.id}
                  </p>
                </div>
              </div>
              <span className="hidden text-sm text-muted-foreground md:inline">{p.brand}</span>
              <span className="hidden font-medium text-foreground md:inline">{p.price}</span>
              <span className="hidden text-sm md:inline">
                <span className={p.stock === 0 ? "text-destructive" : p.stock < 5 ? "text-amber-600" : "text-foreground"}>
                  {p.stock}
                </span>
              </span>
              <span className="hidden md:inline"><StatusBadge status={p.status} /></span>
              <Button variant="ghost" size="icon" aria-label="Row actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            <span>Showing 1–6 of 486</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
              {[1, 2, 3, 4].map((n) => (
                <Button
                  key={n}
                  variant={n === 1 ? "default" : "outline"}
                  size="sm"
                  className={n === 1 ? "h-8 w-8 bg-primary text-primary-foreground" : "h-8 w-8"}
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
