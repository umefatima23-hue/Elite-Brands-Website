import { createFileRoute } from "@tanstack/react-router";
import { Banknote, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, SectionCard, ChartPlaceholder } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Elite Brands Admin" },
      { name: "description", content: "Revenue, funnel and product performance." },
      { property: "og:title", content: "Analytics — Elite Brands Admin" },
      { property: "og:description", content: "Deep view of boutique performance." },
    ],
  }),
  component: AnalyticsPage,
});

const bestSellers = [
  { name: "Obsidian Silk Trench", brand: "Maison Noir", units: 128, revenue: "€241,920" },
  { name: "Ivory Cashmere Coat", brand: "Rive Blanche", units: 96, revenue: "€224,640" },
  { name: "Gilded Leather Loafers", brand: "Aurum", units: 184, revenue: "€143,520" },
  { name: "Champagne Silk Slip", brand: "Rive Blanche", units: 210, revenue: "€134,400" },
  { name: "Vintage Gold Cufflinks", brand: "Aurum", units: 302, revenue: "€126,840" },
];

function AnalyticsPage() {
  return (
    <AdminLayout
      eyebrow="Insight"
      title="Analytics"
      description="How the boutique is performing this quarter."
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value="€384,220" delta="+18.4%" icon={Banknote} hint="This quarter" />
        <StatCard label="Conversion" value="4.82%" delta="+0.6%" icon={TrendingUp} hint="Visitor → order" />
        <StatCard label="AOV" value="€612" delta="+4.1%" icon={ShoppingBag} />
        <StatCard label="New clients" value="1,142" delta="-2.3%" trend="down" icon={Users} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Revenue" description="Weekly rollup for the quarter">
          <ChartPlaceholder height={300} />
        </SectionCard>
        <SectionCard title="Traffic sources">
          <ul className="space-y-4">
            {[
              { label: "Direct", value: 42 },
              { label: "Search", value: 28 },
              { label: "Social", value: 18 },
              { label: "Referral", value: 8 },
              { label: "Email", value: 4 },
            ].map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{s.label}</span>
                  <span className="font-medium text-muted-foreground">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-gold"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Best-selling products" description="Ranked by revenue this quarter">
          <ol className="space-y-3">
            {bestSellers.map((p, i) => (
              <li key={p.name} className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-soft/40 font-serif text-sm text-gold-deep ring-1 ring-gold/40">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.brand} · {p.units} sold</p>
                </div>
                <span className="font-medium text-foreground">{p.revenue}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Sales by channel" description="Distribution across storefronts">
          <ChartPlaceholder height={300} />
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
