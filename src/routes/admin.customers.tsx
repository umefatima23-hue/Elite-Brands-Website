import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, UserPlus, Mail, Phone, Crown, ShoppingBag } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionCard, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Badge } from "@/ui/badge";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Elite Brands Admin" },
      { name: "description", content: "Your private client roster and their history." },
      { property: "og:title", content: "Customers — Elite Brands Admin" },
      { property: "og:description", content: "Manage private clients and memberships." },
    ],
  }),
  component: CustomersPage,
});

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spend: string;
  tier: "Noir" | "Ivoire" | "Or";
};

const customers: Customer[] = [
  { id: "C-2201", name: "Alexandra Sinclair", email: "alexandra@sinclair.co", phone: "+33 6 12 34 56 78", orders: 27, spend: "€48,220", tier: "Noir" },
  { id: "C-2202", name: "Rafael Moreno", email: "r.moreno@atelier.es", phone: "+34 612 998 210", orders: 14, spend: "€21,340", tier: "Or" },
  { id: "C-2203", name: "Yui Tanaka", email: "yui@tanaka.jp", phone: "+81 90 1234 5678", orders: 22, spend: "€36,905", tier: "Noir" },
  { id: "C-2204", name: "Noah Bennett", email: "noah@bennett.co.uk", phone: "+44 7700 900123", orders: 6, spend: "€4,120", tier: "Ivoire" },
  { id: "C-2205", name: "Léa Dubois", email: "lea.dubois@maison.fr", phone: "+33 6 98 76 54 32", orders: 11, spend: "€15,880", tier: "Or" },
];

function CustomersPage() {
  const [selected, setSelected] = useState<Customer>(customers[0]);
  return (
    <AdminLayout
      eyebrow="Clientele"
      title="Customers"
      description="Your private client roster, memberships and lifetime value."
      actions={
        <Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
          <UserPlus className="mr-1 h-4 w-4" /> Invite client
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <SectionCard title="All customers" description="Search and select to view a profile.">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or email…" className="h-10 rounded-full border-border bg-secondary pl-9" />
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            {customers.map((c) => {
              const active = selected.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={
                    "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 transition-colors " +
                    (active ? "bg-gold-soft/30" : "hover:bg-secondary/40")
                  }
                >
                  <Avatar className="h-10 w-10 border border-gold/40">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-foreground">{c.spend}</p>
                    <p className="text-xs text-muted-foreground">{c.orders} orders</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Profile">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-gold/60">
                <AvatarFallback className="bg-primary font-serif text-xl text-primary-foreground">
                  {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="truncate font-serif text-xl text-foreground">{selected.name}</h3>
                <Badge className="mt-1 border border-gold/40 bg-gold-soft/40 text-[10px] uppercase tracking-[0.18em] text-gold-deep">
                  <Crown className="mr-1 h-3 w-3" /> {selected.tier} member
                </Badge>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm">
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-gold" /> {selected.email}
              </p>
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-gold" /> {selected.phone}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Lifetime</p>
                <p className="mt-1 font-serif text-lg text-foreground">{selected.spend}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Orders</p>
                <p className="mt-1 font-serif text-lg text-foreground">{selected.orders}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Order history"
            description="Most recent transactions"
            action={<ShoppingBag className="h-4 w-4 text-gold" />}
          >
            <ul className="space-y-3">
              {[
                { id: "#EB-10428", date: "Jul 22", total: "€1,240", status: "paid" as const },
                { id: "#EB-10390", date: "Jun 30", total: "€860", status: "delivered" as const },
                { id: "#EB-10331", date: "May 12", total: "€2,410", status: "delivered" as const },
              ].map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-foreground">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{o.total}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </AdminLayout>
  );
}
