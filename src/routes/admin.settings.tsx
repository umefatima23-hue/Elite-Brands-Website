import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionCard } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Store Settings — Elite Brands Admin" },
      { name: "description", content: "Configure your boutique, shipping, taxes and branding." },
      { property: "og:title", content: "Store Settings — Elite Brands Admin" },
      { property: "og:description", content: "Boutique preferences and branding." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AdminLayout
      eyebrow="Configuration"
      title="Store settings"
      description="Boutique identity, logistics, taxes and branding."
      actions={<Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">Save changes</Button>}
    >
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-1 bg-secondary/60 p-1">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <SectionCard title="Store information" description="Public identity of the boutique.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>Store name</Label><Input defaultValue="Elite Brands" /></div>
              <div className="grid gap-2"><Label>Legal name</Label><Input defaultValue="Elite Brands SAS" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label>Tagline</Label><Input defaultValue="A private atelier of iconic maisons." /></div>
              <div className="grid gap-2 sm:col-span-2"><Label>About</Label><Textarea rows={4} defaultValue="Elite Brands curates rare pieces from the world's most exceptional houses…" /></div>
              <div className="grid gap-2"><Label>Currency</Label><Input defaultValue="EUR (€)" /></div>
              <div className="grid gap-2"><Label>Timezone</Label><Input defaultValue="Europe/Paris" /></div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <SectionCard title="Contact" description="How clients reach the concierge.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>Support email</Label><Input defaultValue="concierge@elitebrands.co" /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input defaultValue="+33 1 42 60 00 00" /></div>
              <div className="grid gap-2 sm:col-span-2"><Label>Address</Label><Input defaultValue="12 Rue Saint-Honoré, 75001 Paris" /></div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SectionCard title="Social links">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>Instagram</Label><Input placeholder="https://instagram.com/elitebrands" /></div>
              <div className="grid gap-2"><Label>TikTok</Label><Input placeholder="https://tiktok.com/@elitebrands" /></div>
              <div className="grid gap-2"><Label>Pinterest</Label><Input placeholder="https://pinterest.com/elitebrands" /></div>
              <div className="grid gap-2"><Label>YouTube</Label><Input placeholder="https://youtube.com/@elitebrands" /></div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <SectionCard title="Shipping zones">
            <div className="space-y-3">
              {[
                { zone: "France", rate: "Complimentary", eta: "1–2 days" },
                { zone: "European Union", rate: "€25", eta: "2–4 days" },
                { zone: "United Kingdom", rate: "€45", eta: "3–5 days" },
                { zone: "Rest of world", rate: "€90", eta: "5–8 days" },
              ].map((z) => (
                <div key={z.zone} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{z.zone}</p>
                    <p className="text-xs text-muted-foreground">{z.eta}</p>
                  </div>
                  <span className="font-medium text-foreground">{z.rate}</span>
                </div>
              ))}
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Signature required</p>
                <p className="text-xs text-muted-foreground">On all orders above €500</p>
              </div>
              <Switch defaultChecked />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <SectionCard title="Taxes">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2"><Label>VAT rate</Label><Input defaultValue="20%" /></div>
              <div className="grid gap-2"><Label>VAT number</Label><Input defaultValue="FR 12 345678901" /></div>
              <div className="grid gap-2"><Label>Rounding</Label><Input defaultValue="Nearest cent" /></div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Prices include tax</p>
                <p className="text-xs text-muted-foreground">Show gross prices on storefront</p>
              </div>
              <Switch defaultChecked />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <SectionCard title="Branding" description="Marque, palette and typography.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Logo</Label>
                <div className="grid h-32 place-items-center rounded-xl border border-dashed border-gold/50 bg-gold-soft/20 text-sm text-muted-foreground">
                  Drop SVG or PNG
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Favicon</Label>
                <div className="grid h-32 place-items-center rounded-xl border border-dashed border-border bg-secondary/60 text-sm text-muted-foreground">
                  32×32 ICO / PNG
                </div>
              </div>
              <div className="grid gap-2"><Label>Primary colour</Label><Input defaultValue="#0F0E0C" /></div>
              <div className="grid gap-2"><Label>Accent (gold)</Label><Input defaultValue="#C8A96A" /></div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
