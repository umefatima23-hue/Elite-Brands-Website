import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  ShoppingBag,
  Users,
  Package,
  Plus,
  ArrowUpRight,
  Sparkles,
  Ticket,
  Truck,
  UserPlus,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, SectionCard, StatusBadge, ChartPlaceholder } from "@/components/admin/ui";
import { Button } from "@/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Elite Brands" },
      {
        name: "description",
        content:
          "Elite Brands atelier admin overview: revenue, orders, customers and catalogue at a glance.",
      },
      { property: "og:title", content: "Admin Dashboard — Elite Brands" },
      {
        property: "og:description",
        content: "Revenue, orders and catalogue in one refined workspace.",
      },
    ],
  }),
  component: AdminDashboard,
});

const recent = [
  { id: "#EB-10428", customer: "Alexandra Sinclair", amount: "€1,240.00", status: "paid" as const },
  { id: "#EB-10427", customer: "Rafael Moreno", amount: "€720.00", status: "shipped" as const },
  { id: "#EB-10426", customer: "Yui Tanaka", amount: "€2,980.00", status: "pending" as const },
  { id: "#EB-10425", customer: "Noah Bennett", amount: "€460.00", status: "delivered" as const },
  { id: "#EB-10424", customer: "Léa Dubois", amount: "€1,860.00", status: "paid" as const },
];

const activity = [
  { icon: ShoppingBag, text: "New order #EB-10428 from Alexandra S.", time: "2m ago" },
  { icon: UserPlus, text: "Camille Laurent joined Noir membership", time: "18m ago" },
  { icon: Truck, text: "Order #EB-10422 handed to courier", time: "1h ago" },
  { icon: Ticket, text: "Coupon PRIVATE20 redeemed 4 times", time: "3h ago" },
  { icon: Sparkles, text: "Product 'Obsidian Silk Trench' published", time: "Yesterday" },
];

function AdminDashboard() {
  return (
    <AdminLayout
      eyebrow="Atelier"
      title="Good evening"
      description="A refined pulse of your boutique — revenue, orders and clients this week."
      actions={
        <>
          <Button variant="outline" className="border-foreground/20 hover:border-gold hover:text-gold-deep">
            Export
          </Button>
          <Button asChild className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
            <Link to="/admin/products/new">
              <Plus className="mr-1 h-4 w-4" /> New product
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value="€128,420" delta="+12.4%" icon={Banknote} hint="vs last month" />
        <StatCard label="Orders" value="1,284" delta="+6.1%" icon={ShoppingBag} hint="342 this week" />
        <StatCard label="Customers" value="8,942" delta="+3.2%" icon={Users} hint="120 new" />
        <StatCard label="Products" value="486" delta="-1.4%" trend="down" icon={Package} hint="12 low stock" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Sales overview"
          description="Revenue across the last 12 months"
          action={
            <div className="flex gap-1 rounded-full border border-border bg-secondary p-1 text-xs">
              {["Week", "Month", "Year"].map((k, i) => (
                <button
                  key={k}
                  className={
                    i === 1
                      ? "rounded-full bg-background px-3 py-1 font-medium text-foreground shadow-sm"
                      : "rounded-full px-3 py-1 text-muted-foreground hover:text-foreground"
                  }
                >
                  {k}
                </button>
              ))}
            </div>
          }
        >
          <ChartPlaceholder height={280} label="Revenue trend" />
        </SectionCard>

        <SectionCard title="Quick actions" description="Shortcuts to daily tasks">
          <div className="grid gap-2">
            {[
              { to: "/admin/products/new", label: "Add new product", icon: Package },
              { to: "/admin/coupons", label: "Create coupon", icon: Ticket },
              { to: "/admin/orders", label: "Review orders", icon: ShoppingBag },
              { to: "/admin/customers", label: "Invite customer", icon: UserPlus },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-gold/60 hover:bg-gold-soft/20"
              >
                <span className="inline-flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-soft/40 ring-1 ring-gold/40">
                    <a.icon className="h-4 w-4 text-gold-deep" />
                  </span>
                  <span className="font-medium text-foreground">{a.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Recent orders"
          description="Latest transactions across the boutique"
          action={
            <Button asChild variant="ghost" className="text-gold-deep hover:text-gold">
              <Link to="/admin/orders">View all</Link>
            </Button>
          }
        >
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1.1fr_2fr_1fr_1fr] items-center gap-4 border-b border-border bg-secondary/60 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span>Order</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {recent.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-[1.1fr_2fr_1fr_1fr] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-secondary/40"
              >
                <span className="font-mono text-xs text-foreground">{o.id}</span>
                <span className="truncate text-foreground">{o.customer}</span>
                <span className="font-medium text-foreground">{o.amount}</span>
                <span><StatusBadge status={o.status} /></span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" description="Live updates from your team & clients">
          <ul className="space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-soft/40 ring-1 ring-gold/40">
                  <a.icon className="h-4 w-4 text-gold-deep" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
