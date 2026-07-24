import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, Filter, Package } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge, EmptyState } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { Separator } from "@/ui/separator";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Elite Brands Admin" },
      { name: "description", content: "Review, fulfil and refund boutique orders." },
      { property: "og:title", content: "Orders — Elite Brands Admin" },
      { property: "og:description", content: "Track every transaction across the atelier." },
    ],
  }),
  component: OrdersPage,
});

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: string;
  status: "paid" | "pending" | "shipped" | "delivered" | "refunded" | "cancelled";
};

const orders: Order[] = [
  { id: "#EB-10428", customer: "Alexandra Sinclair", email: "alexandra@sinclair.co", date: "Jul 22, 2026", items: 3, total: "€1,240.00", status: "paid" },
  { id: "#EB-10427", customer: "Rafael Moreno", email: "r.moreno@atelier.es", date: "Jul 22, 2026", items: 1, total: "€720.00", status: "shipped" },
  { id: "#EB-10426", customer: "Yui Tanaka", email: "yui@tanaka.jp", date: "Jul 21, 2026", items: 5, total: "€2,980.00", status: "pending" },
  { id: "#EB-10425", customer: "Noah Bennett", email: "noah@bennett.co.uk", date: "Jul 21, 2026", items: 2, total: "€460.00", status: "delivered" },
  { id: "#EB-10424", customer: "Léa Dubois", email: "lea.dubois@maison.fr", date: "Jul 20, 2026", items: 4, total: "€1,860.00", status: "paid" },
  { id: "#EB-10423", customer: "Marco Villa", email: "marco@villa.it", date: "Jul 19, 2026", items: 1, total: "€310.00", status: "refunded" },
];

function OrdersPage() {
  const [open, setOpen] = useState<Order | null>(null);

  return (
    <AdminLayout
      eyebrow="Operations"
      title="Orders"
      description="Every transaction across the boutique — from checkout to doorstep."
      actions={
        <Button variant="outline" className="border-foreground/20 hover:border-gold hover:text-gold-deep">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-luxe">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order, customer, email…" className="h-10 rounded-full border-border bg-secondary pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[150px] rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="30">
          <SelectTrigger className="h-10 w-[150px] rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-10 rounded-full border-border">
          <Filter className="mr-2 h-4 w-4" /> More
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Package} title="No orders yet" description="Once your first order arrives, it'll appear here." />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-luxe">
          <div className="hidden grid-cols-[1.1fr_2fr_1.1fr_0.6fr_1fr_1fr] items-center gap-4 border-b border-border bg-secondary/60 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setOpen(o)}
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-4 py-4 text-left last:border-b-0 hover:bg-secondary/40 md:grid-cols-[1.1fr_2fr_1.1fr_0.6fr_1fr_1fr]"
            >
              <span className="font-mono text-xs text-foreground">{o.id}</span>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{o.customer}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{o.email}</p>
              </div>
              <span className="hidden text-sm text-muted-foreground md:inline">{o.date}</span>
              <span className="hidden text-sm text-muted-foreground md:inline">{o.items}</span>
              <span className="hidden font-medium text-foreground md:inline">{o.total}</span>
              <span className="hidden md:inline"><StatusBadge status={o.status} /></span>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {open && (
            <>
              <SheetHeader>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Order details</p>
                <SheetTitle className="font-serif text-2xl">{open.id}</SheetTitle>
                <SheetDescription>Placed {open.date} · {open.items} items</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={open.status} />
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-serif text-xl text-foreground">{open.total}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Customer</h4>
                  <p className="mt-2 font-medium text-foreground">{open.customer}</p>
                  <p className="text-sm text-muted-foreground">{open.email}</p>
                </div>

                <div>
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Items</h4>
                  <ul className="mt-3 space-y-3">
                    {Array.from({ length: Math.min(open.items, 3) }).map((_, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-secondary to-gold-soft/40 ring-1 ring-border" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">Obsidian Silk Piece {i + 1}</p>
                          <p className="text-xs text-muted-foreground">Size M · Qty 1</p>
                        </div>
                        <span className="text-sm font-medium">€ 620.00</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Shipping</h4>
                  <p className="mt-2 text-sm text-foreground">12 Rue Saint-Honoré</p>
                  <p className="text-sm text-muted-foreground">75001 Paris, France</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
                    Mark as fulfilled
                  </Button>
                  <Button variant="outline" className="flex-1">Refund</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
