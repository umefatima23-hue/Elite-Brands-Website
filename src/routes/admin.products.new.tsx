import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Save, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionCard } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({
    meta: [
      { title: "New Product — Elite Brands Admin" },
      { name: "description", content: "Compose a new piece for the boutique." },
      { property: "og:title", content: "New Product — Elite Brands Admin" },
      { property: "og:description", content: "Add media, pricing, inventory and SEO." },
    ],
  }),
  component: ProductEditor,
});

function ProductEditor() {
  return (
    <AdminLayout
      eyebrow="Catalogue"
      title="New product"
      description="Compose an entry with media, pricing, inventory and search metadata."
      actions={
        <>
          <Button asChild variant="ghost">
            <Link to="/admin/products">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button variant="outline" className="border-foreground/20">
            Save draft
          </Button>
          <Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
            <Save className="mr-1 h-4 w-4" /> Publish
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <SectionCard title="Overview" description="Public-facing information for this piece.">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g. Obsidian Silk Trench" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  rows={6}
                  placeholder="A refined description that tells the story of this piece…"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noir">Maison Noir</SelectItem>
                      <SelectItem value="rive">Rive Blanche</SelectItem>
                      <SelectItem value="aurum">Aurum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="tailoring">Tailoring</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Media" description="Cover image plus up to 8 gallery shots.">
            <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
              <button
                type="button"
                className="group grid aspect-[3/4] place-items-center rounded-xl border border-dashed border-gold/50 bg-gold-soft/20 text-center transition-colors hover:bg-gold-soft/40"
              >
                <div>
                  <ImagePlus className="mx-auto h-8 w-8 text-gold-deep" />
                  <p className="mt-2 text-sm font-medium text-foreground">Cover image</p>
                  <p className="mt-1 text-xs text-muted-foreground">1200×1600 · JPG/PNG</p>
                </div>
              </button>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="grid aspect-square place-items-center rounded-lg border border-dashed border-border bg-secondary/60 text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep"
                    aria-label={`Add gallery image ${i + 1}`}
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Pricing">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input placeholder="€ 0.00" />
              </div>
              <div className="grid gap-2">
                <Label>Compare-at</Label>
                <Input placeholder="€ 0.00" />
              </div>
              <div className="grid gap-2">
                <Label>Cost</Label>
                <Input placeholder="€ 0.00" />
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Taxable</p>
                <p className="text-xs text-muted-foreground">Apply local VAT at checkout</p>
              </div>
              <Switch defaultChecked />
            </div>
          </SectionCard>

          <SectionCard title="Inventory">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>SKU</Label>
                <Input placeholder="EB-…" />
              </div>
              <div className="grid gap-2">
                <Label>Barcode</Label>
                <Input placeholder="ISBN, UPC, GTIN" />
              </div>
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Track inventory</p>
                <p className="text-xs text-muted-foreground">Warn when stock is low</p>
              </div>
              <Switch defaultChecked />
            </div>
          </SectionCard>

          <SectionCard title="SEO" description="How this piece appears in search & social.">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Page title</Label>
                <Input placeholder="Obsidian Silk Trench — Maison Noir" />
              </div>
              <div className="grid gap-2">
                <Label>Meta description</Label>
                <Textarea rows={3} placeholder="Concise, evocative summary under 160 characters." />
              </div>
              <div className="grid gap-2">
                <Label>URL handle</Label>
                <Input placeholder="/product/obsidian-silk-trench" />
              </div>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Status">
            <div className="grid gap-3">
              <Select defaultValue="draft">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span>Featured on homepage</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span>Private client only</span>
                <Switch />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Organisation">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Collections</Label>
                <Input placeholder="Winter '26, Icons…" />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <Input placeholder="silk, trench, black" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Shipping">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Weight</Label>
                <Input placeholder="0.00 kg" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span>Requires signature</span>
                <Switch defaultChecked />
              </div>
            </div>
          </SectionCard>
        </aside>
      </div>
    </AdminLayout>
  );
}
