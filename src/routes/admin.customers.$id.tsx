import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Input } from "@/ui/input";
import { Switch } from "@/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Loading } from "@/common/loading";
import { formatPrice } from "@/lib/format";
import {
  getCustomer,
  getCustomerOrders,
  updateCustomerNotes,
  CUSTOMER_STATUSES,
  type AdminCustomerDetail,
  type CustomerOrderSummary,
  type CustomerStatus,
} from "@/lib/admin-customers";

export const Route = createFileRoute("/admin/customers/$id")({
  component: CustomerDetailPage,
});

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  blocked: "Blocked",
  archived: "Archived",
};

type DetailState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; customer: AdminCustomerDetail };

type OrdersState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: CustomerOrderSummary[] };

function CustomerDetailPage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<DetailState>({ status: "loading" });
  const [orders, setOrders] = useState<OrdersState>({ status: "loading" });

  const loadCustomer = () => {
    setState({ status: "loading" });
    getCustomer(id).then((result) => {
      setState(
        result.success
          ? { status: "ready", customer: result.data }
          : { status: "error", message: result.error.message },
      );
    });
  };

  useEffect(() => {
    loadCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setOrders({ status: "loading" });
    getCustomerOrders(id).then((result) => {
      if (cancelled) return;
      setOrders(
        result.success
          ? { status: "ready", orders: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") return <Loading label="Loading customer" />;
  if (state.status === "error") {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        {state.message}
      </p>
    );
  }

  const { customer } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">{customer.fullName}</h2>
          <p className="text-sm text-muted-foreground">
            Customer since {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/customers">Back to Customers</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Lifetime Orders"
          value={customer.lifetimeOrdersCount.toLocaleString()}
        />
        <SummaryCard label="Lifetime Spend" value={formatPrice(customer.lifetimeSpend)} />
        <SummaryCard
          label="Last Order"
          value={customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-border bg-card shadow-elite-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-medium text-foreground">Order History</h3>
            </div>
            <CustomerOrdersTable state={orders} />
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-elite-sm">
            <h3 className="mb-4 text-base font-medium text-foreground">Contact</h3>
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Email</dt>
                <dd className="mt-1 text-foreground">{customer.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Phone</dt>
                <dd className="mt-1 text-foreground">{customer.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-foreground">{customer.whatsapp ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Preferred Contact
                </dt>
                <dd className="mt-1 capitalize text-foreground">
                  {customer.preferredContactMethod}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <CustomerNotesForm customer={customer} onSaved={loadCustomer} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-elite-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-medium text-foreground">{value}</p>
    </div>
  );
}

function CustomerOrdersTable({ state }: { state: OrdersState }) {
  if (state.status === "loading") {
    return (
      <div className="space-y-3 p-6">
        {[0, 1].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }
  if (state.status === "error")
    return <p className="p-6 text-sm text-muted-foreground">{state.message}</p>;
  if (state.orders.length === 0)
    return <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <th className="px-6 py-3 font-medium">Order</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Total</th>
            <th className="px-6 py-3 font-medium">Placed</th>
          </tr>
        </thead>
        <tbody>
          {state.orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-6 py-3 font-medium text-foreground">{order.orderNumber}</td>
              <td className="px-6 py-3 capitalize text-muted-foreground">
                {order.status.replace(/_/g, " ")}
              </td>
              <td className="px-6 py-3 text-foreground">{formatPrice(order.grandTotal)}</td>
              <td className="px-6 py-3 text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerNotesForm({
  customer,
  onSaved,
}: {
  customer: AdminCustomerDetail;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<CustomerStatus>(customer.status);
  const [notes, setNotes] = useState(customer.internalNotes);
  const [tagsInput, setTagsInput] = useState(customer.tags.join(", "));
  const [marketingOptIn, setMarketingOptIn] = useState(customer.marketingOptIn);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const result = await updateCustomerNotes(customer.id, {
      status,
      internalNotes: notes,
      tags,
      marketingOptIn,
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    toast.success("Customer updated.");
    onSaved();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="h-fit space-y-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm"
    >
      <h3 className="text-base font-medium text-foreground">Manage</h3>
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as CustomerStatus)}>
          <SelectTrigger id="status" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CUSTOMER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="vip, wholesale"
          className="mt-1.5"
        />
        <p className="mt-1 text-xs text-muted-foreground">Comma-separated.</p>
      </div>
      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <p className="text-sm font-medium text-foreground">Marketing Opt-in</p>
        <Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} />
      </div>
      <div>
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-1.5"
        />
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={customer.deletedAt ? "destructive" : "outline"}>
          {customer.deletedAt ? "Deleted" : "Active record"}
        </Badge>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
