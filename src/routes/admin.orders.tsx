import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Button } from "@/ui/button";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/admin/order-status-badges";
import {
  listOrdersAdmin,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type AdminOrderListItem,
  type OrderStatusValue,
  type PaymentStatusValue,
} from "@/lib/admin-orders";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const PAGE_SIZE = 20;

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: AdminOrderListItem[]; total: number };

function AdminOrdersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatusValue | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusValue | "all">("all");
  const [page, setPage] = useState(1);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    listOrdersAdmin({ search, status, paymentStatus, page, pageSize: PAGE_SIZE }).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", items: result.data.items, total: result.data.total }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [search, status, paymentStatus, page]);

  const total = state.status === "ready" ? state.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-foreground">Orders</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by order #, name, phone, email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as OrderStatusValue | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={paymentStatus}
          onValueChange={(v) => {
            setPaymentStatus(v as PaymentStatusValue | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment statuses</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {PAYMENT_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-elite-sm">
        {state.status === "loading" && (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="p-6 text-sm text-muted-foreground">{state.message}</p>
        )}

        {state.status === "ready" && state.items.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No orders match these filters.</p>
        )}

        {state.status === "ready" && state.items.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {order.orderSource.replace(/_/g, " ")}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{order.contactName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.contactPhone ?? order.contactEmail ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatPrice(order.grandTotal)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/admin/orders/$id" params={{ id: order.id }}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {state.status === "ready" && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {page} of {totalPages} · {total} order{total === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
