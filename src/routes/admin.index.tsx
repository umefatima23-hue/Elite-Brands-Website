import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentOrders,
  type DashboardStats,
  type RecentOrderSummary,
} from "@/lib/admin";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

function AdminDashboardPage() {
  const [stats, setStats] = useState<LoadState<DashboardStats>>({ status: "loading" });
  const [orders, setOrders] = useState<LoadState<RecentOrderSummary[]>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getDashboardStats().then((result) => {
      if (cancelled) return;
      setStats(
        result.success
          ? { status: "ready", data: result.stats }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getRecentOrders(5).then((result) => {
      if (cancelled) return;
      setOrders(
        result.success
          ? { status: "ready", data: result.orders }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          state={stats}
          render={(data) => data.totalOrders.toLocaleString()}
        />
        <StatCard
          label="Products"
          state={stats}
          render={(data) => data.totalProducts.toLocaleString()}
        />
        <StatCard
          label="Customers"
          state={stats}
          render={(data) => data.totalCustomers.toLocaleString()}
        />
        <StatCard label="Revenue" state={stats} render={(data) => formatPrice(data.revenue)} />
      </div>

      <section className="rounded-lg border border-border bg-card shadow-elite-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-medium text-foreground">Recent Orders</h2>
        </div>
        <RecentOrdersTable state={orders} />
      </section>
    </div>
  );
}

function StatCard<T>({
  label,
  state,
  render,
}: {
  label: string;
  state: LoadState<T>;
  render: (data: T) => string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-elite-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-medium text-foreground">
        {state.status === "loading" && (
          <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted align-middle" />
        )}
        {state.status === "error" && (
          <span className="text-sm font-normal text-destructive">Unavailable</span>
        )}
        {state.status === "ready" && render(state.data)}
      </p>
    </div>
  );
}

function RecentOrdersTable({ state }: { state: LoadState<RecentOrderSummary[]> }) {
  if (state.status === "loading") {
    return (
      <div className="space-y-3 p-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <p className="p-6 text-sm text-muted-foreground">{state.message}</p>;
  }

  if (state.data.length === 0) {
    return <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <th className="px-6 py-3 font-medium">Order</th>
            <th className="px-6 py-3 font-medium">Customer</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Total</th>
            <th className="px-6 py-3 font-medium">Placed</th>
          </tr>
        </thead>
        <tbody>
          {state.data.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-6 py-3 font-medium text-foreground">{order.orderNumber}</td>
              <td className="px-6 py-3 text-muted-foreground">{order.contactName ?? "—"}</td>
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
