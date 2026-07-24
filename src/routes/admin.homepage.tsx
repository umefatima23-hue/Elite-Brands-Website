import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionCard } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({
    meta: [
      { title: "Homepage — Elite Brands Admin" },
      { name: "description", content: "Compose the boutique landing experience." },
      { property: "og:title", content: "Homepage — Elite Brands Admin" },
      { property: "og:description", content: "Curate the boutique's first impression." },
    ],
  }),
  component: HomepagePage,
});

function HomepagePage() {
  return (
    <AdminLayout
      eyebrow="Storefront"
      title="Homepage"
      description="Compose the sections that greet every visitor."
      actions={<Button className="bg-gradient-gold text-gold-foreground shadow-luxe">Publish changes</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <SectionCard title="Hero" description="The opening statement of the boutique.">
            <div className="grid gap-4">
              <div className="grid gap-2"><Label>Eyebrow</Label><Input defaultValue="Winter '26 collection" /></div>
              <div className="grid gap-2"><Label>Headline</Label><Input defaultValue="A private atelier of iconic maisons." /></div>
              <div className="grid gap-2"><Label>Subheading</Label><Textarea rows={3} defaultValue="Rare pieces, complimentary concierge, private appointments in Paris & Milan." /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label>Primary CTA</Label><Input defaultValue="Explore collection" /></div>
                <div className="grid gap-2"><Label>Secondary CTA</Label><Input defaultValue="Book appointment" /></div>
              </div>
              <div className="grid h-40 place-items-center rounded-xl border border-dashed border-gold/50 bg-gold-soft/20 text-sm text-muted-foreground">
                Hero image · 1920×1080
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Featured collections" description="Up to 3 collections spotlighted below the hero.">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Winter '26", "Icons", "Private edit"].map((c) => (
                <div key={c} className="rounded-xl border border-border bg-background/60 p-3">
                  <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-secondary to-gold-soft/40 ring-1 ring-border" />
                  <p className="mt-3 font-serif text-sm text-foreground">{c}</p>
                  <p className="text-xs text-muted-foreground">— products</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Editorial" description="A story to accompany the collection.">
            <div className="grid gap-4">
              <div className="grid gap-2"><Label>Title</Label><Input defaultValue="Notes on obsidian" /></div>
              <div className="grid gap-2"><Label>Body</Label><Textarea rows={5} defaultValue="On the enduring appeal of black silk, and why every wardrobe deserves its own midnight moment…" /></div>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Sections">
            <div className="grid gap-3">
              {[
                { name: "Hero", on: true },
                { name: "Featured collections", on: true },
                { name: "New arrivals", on: true },
                { name: "Editorial", on: true },
                { name: "Best sellers", on: false },
                { name: "Testimonials", on: false },
                { name: "Newsletter", on: true },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
                  <span className="text-foreground">{s.name}</span>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Announcement bar">
            <div className="grid gap-3">
              <Input defaultValue="Complimentary express shipping across the EU" />
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <span>Visible</span>
                <Switch defaultChecked />
              </div>
            </div>
          </SectionCard>
        </aside>
      </div>
    </AdminLayout>
  );
}
