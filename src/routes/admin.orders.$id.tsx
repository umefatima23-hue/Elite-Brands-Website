import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Loading } from "@/common/loading";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ORDER_STATUS_LABELS,
} from "@/admin/order-status-badges";
import { getOrderAdmin, type AdminOrderDetail, type AdminOrderEvent } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetailPage,
});

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; order: AdminOrderDetail };

function AdminOrderDetailPage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getOrderAdmin(id).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", order: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") return <Loading label="Loading order" />;

  if (state.status === "error") {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  const order = state.order;

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()} ·{" "}
            {order.orderSource.replace(/_/g, " ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InvoiceCard order={order} />
          <TimelineCard events={order.events} />
        </div>

        <div className="space-y-6">
          <CustomerSummaryCard order={order} />
          <PaymentShippingCard order={order} />
          <AddressCard title="Shipping Address" address={order.shippingAddress} />
          <AddressCard title="Billing Address" address={order.billingAddress} />
          {(order.customerNotes || order.internalNotes) && <NotesCard order={order} />}
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link to="/admin/orders">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Link>
    </Button>
  );
}

function InvoiceCard({ order }: { order: AdminOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Item</th>
                <th className="py-2 pr-4 font-medium">SKU</th>
                <th className="py-2 pr-4 font-medium text-right">Qty</th>
                <th className="py-2 pr-4 font-medium text-right">Unit Price</th>
                <th className="py-2 font-medium text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-sm text-muted-foreground">
                    No items on this order.
                  </td>
                </tr>
              )}
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.brand, item.variantName].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                    {item.skuSnapshot}
                  </td>
                  <td className="py-3 pr-4 text-right text-foreground">{item.quantity}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-medium text-foreground">
                    {formatPrice(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Separator />

        <div className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span>-{formatPrice(order.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{formatPrice(order.shippingTotal)}</span>
          </div>
          {order.taxTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(order.taxTotal)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-base font-medium text-foreground">
            <span>Total</span>
            <span>{formatPrice(order.grandTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ events }: { events: AdminOrderEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No timeline events yet.</p>
        ) : (
          <ol className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">
                    {event.message ??
                      (event.toStatus
                        ? `Status changed to ${ORDER_STATUS_LABELS[event.toStatus]}`
                        : event.eventType.replace(/_/g, " "))}
                    {event.isInternal && (
                      <span className="ml-2 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                        Internal
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function CustomerSummaryCard({ order }: { order: AdminOrderDetail }) {
  const c = order.customer;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium text-foreground">{order.contactName ?? c?.fullName ?? "—"}</p>
        <p className="text-muted-foreground">{order.contactPhone ?? c?.phone ?? "—"}</p>
        <p className="text-muted-foreground">{order.contactEmail ?? c?.email ?? "—"}</p>
        {c && (
          <>
            <Separator className="my-3" />
            <div className="flex justify-between text-muted-foreground">
              <span>Lifetime orders</span>
              <span className="text-foreground">{c.lifetimeOrdersCount}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Lifetime spend</span>
              <span className="text-foreground">{formatPrice(c.lifetimeSpend)}</span>
            </div>
            {c.lastOrderAt && (
              <div className="flex justify-between text-muted-foreground">
                <span>Last order</span>
                <span className="text-foreground">
                  {new Date(c.lastOrderAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentShippingCard({ order }: { order: AdminOrderDetail }) {
  const milestones: { label: string; at: string | null }[] = [
    { label: "Confirmed", at: order.confirmedAt },
    { label: "Packed", at: order.packedAt },
    { label: "Dispatched", at: order.dispatchedAt },
    { label: "Delivered", at: order.deliveredAt },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payment &amp; Shipping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Payment method</span>
          <span className="capitalize text-foreground">
            {order.paymentMethod.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Cash on delivery</span>
          <span className="text-foreground">{order.isCod ? "Yes" : "No"}</span>
        </div>
        <Separator />
        {milestones.map((m) => (
          <div key={m.label} className="flex justify-between text-muted-foreground">
            <span>{m.label}</span>
            <span className="text-foreground">{m.at ? new Date(m.at).toLocaleString() : "—"}</span>
          </div>
        ))}
        {order.cancelledAt && (
          <div className="flex justify-between text-muted-foreground">
            <span>Cancelled</span>
            <span className="text-foreground">{new Date(order.cancelledAt).toLocaleString()}</span>
          </div>
        )}
        {order.returnedAt && (
          <div className="flex justify-between text-muted-foreground">
            <span>Returned</span>
            <span className="text-foreground">{new Date(order.returnedAt).toLocaleString()}</span>
          </div>
        )}
        {order.refundedAt && (
          <div className="flex justify-between text-muted-foreground">
            <span>Refunded</span>
            <span className="text-foreground">{new Date(order.refundedAt).toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddressCard({ title, address }: { title: string; address: Record<string, unknown> }) {
  const entries = Object.entries(address).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        {entries.length === 0 ? (
          <p>No address on file.</p>
        ) : (
          entries.map(([key, value]) => (
            <p key={key}>
              <span className="capitalize text-foreground">{key.replace(/_/g, " ")}: </span>
              {String(value)}
            </p>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function NotesCard({ order }: { order: AdminOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {order.customerNotes && (
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Customer notes
            </p>
            <p className="mt-1 text-foreground">{order.customerNotes}</p>
          </div>
        )}
        {order.internalNotes && (
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Internal notes
            </p>
            <p className="mt-1 text-foreground">{order.internalNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
