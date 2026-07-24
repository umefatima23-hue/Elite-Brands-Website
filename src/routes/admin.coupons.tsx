import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge, EmptyState } from "@/components/admin/ui";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons — Elite Brands Admin" },
      { name: "description", content: "Craft private discounts and gift codes." },
      { property: "og:title", content: "Coupons — Elite Brands Admin" },
      { property: "og:description", content: "Manage private client discounts." },
    ],
  }),
  component: CouponsPage,
});

const coupons = [
  { code: "PRIVATE20", type: "20% off", uses: "128 / 500", expires: "Dec 31, 2026", status: "active" as const },
  { code: "NOIR100", type: "€100 off", uses: "42 / 200", expires: "Sep 15, 2026", status: "active" as const },
  { code: "WELCOME10", type: "10% off", uses: "1,204 / ∞", expires: "—", status: "active" as const },
  { code: "SUMMER25", type: "25% off", uses: "890 / 890", expires: "Jul 01, 2026", status: "expired" as const },
];

function CouponsPage() {
  const [open, setOpen] = useState(false);
  return (
    <AdminLayout
      eyebrow="Growth"
      title="Coupons"
      description="Private codes for launches, gifts and loyalty."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95">
              <Plus className="mr-1 h-4 w-4" /> New coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Create coupon</DialogTitle>
              <DialogDescription>Design a private offer for your clientele.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Code</Label>
                <Input placeholder="e.g. NOIR100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select defaultValue="percent">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed amount</SelectItem>
                      <SelectItem value="ship">Free shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input placeholder="20" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Max uses</Label>
                  <Input placeholder="Unlimited" />
                </div>
                <div className="grid gap-2">
                  <Label>Expires</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-gold text-gold-foreground shadow-luxe">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {coupons.length === 0 ? (
        <EmptyState icon={Ticket} title="No coupons yet" description="Design your first private offer." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-luxe">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr] items-center gap-4 border-b border-border bg-secondary/60 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid">
            <span>Code</span>
            <span>Discount</span>
            <span>Uses</span>
            <span>Expires</span>
            <span>Status</span>
          </div>
          {coupons.map((c) => (
            <div
              key={c.code}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-4 py-4 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr]"
            >
              <span className="font-mono text-sm font-semibold tracking-wider text-gold-deep">{c.code}</span>
              <span className="hidden text-sm text-foreground md:inline">{c.type}</span>
              <span className="hidden text-sm text-muted-foreground md:inline">{c.uses}</span>
              <span className="hidden text-sm text-muted-foreground md:inline">{c.expires}</span>
              <span className="md:col-auto"><StatusBadge status={c.status} /></span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
