import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Banknote,
  ShoppingBag,
  TrendingUp,
  Users,
  BarChart3,
  PackageSearch,
  Tags,
  ListTree,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, SectionCard, EmptyState } from "@/components/admin/ui";
import { Skeleton } from "@/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { formatPrice } from "@/lib/format";
import {
  getAnalyticsSummary,
  getRevenueTrend,
  getOrderStatusBreakdown,
  getTopProducts,
  getTopBrands,
  type AnalyticsSummary,
  type RevenueTrendPoint,
  type OrderStatusCount,
  type TopProductEntry,
  type TopBrandEntry,
} from "@/lib/admin-analytics";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Elite Brands Admin" },
      { name: "description", content: "Revenue, orders and product performance." },
      { property: "og:title", content: "Analytics — Elite Brands Admin" },
      { property: "og:description", content: "Real, live view of boutique performance." },
    ],
  }),
  component: AnalyticsPage,
});

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

type Load<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

const ORDER_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  packing: "Packing",
  ready_to_dispatch: "Ready to Dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

function pctDelta(
  current: number,
  previous: number,
): { text: string; trend: "up" | "down" } | undefined {
  if (previous === 0) {
    if (current === 0) return undefined;
    return { text: "New", trend: "up" };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    text: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
    trend: change >= 0 ? "up" : "down",
  };
}

function AnalyticsPage() {
  const [rangeDays, setRangeDays] = useState(30);

  const [summary, setSummary] = useState<Load<AnalyticsSummary>>({ status: "loading" });
  const [trend, setTrend] = useState<Load<RevenueTrendPoint[]>>({ status: "loading" });
  const [statusBreakdown, setStatusBreakdown] = useState<Load<OrderStatusCount[]>>({
    status: "loading",
  });
  const [topProducts, setTopProducts] = useState<Load<TopProductEntry[]>>({ status: "loading" });
  const [topBrands, setTopBrands] = useState<Load<TopBrandEntry[]>>({ status: "loading" });

  // Each section fetches and fails independently — one query erroring out never
  // blanks the rest of the dashboard.
  useEffect(() => {
    let cancelled = false;
    setSummary({ status: "loading" });
    getAnalyticsSummary(rangeDays).then((result) => {
      if (cancelled) return;
      setSummary(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  useEffect(() => {
    let cancelled = false;
    const days = Math.min(rangeDays, 30); // keep the bar list readable
    setTrend({ status: "loading" });
    getRevenueTrend(days).then((result) => {
      if (cancelled) return;
      setTrend(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  useEffect(() => {
    let cancelled = false;
    setStatusBreakdown({ status: "loading" });
    getOrderStatusBreakdown(rangeDays).then((result) => {
      if (cancelled) return;
      setStatusBreakdown(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  useEffect(() => {
    let cancelled = false;
    setTopProducts({ status: "loading" });
    getTopProducts(rangeDays, 5).then((result) => {
      if (cancelled) return;
      setTopProducts(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  useEffect(() => {
    let cancelled = false;
    setTopBrands({ status: "loading" });
    getTopBrands(rangeDays, 5).then((result) => {
      if (cancelled) return;
      setTopBrands(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  const revenueDelta =
    summary.status === "ready"
      ? pctDelta(summary.data.revenue, summary.data.previousRevenue)
      : undefined;
  const orderDelta =
    summary.status === "ready"
      ? pctDelta(summary.data.orderCount, summary.data.previousOrderCount)
      : undefined;
  const aovDelta =
    summary.status === "ready"
      ? pctDelta(summary.data.averageOrderValue, summary.data.previousAverageOrderValue)
      : undefined;
  const customerDelta =
    summary.status === "ready"
      ? pctDelta(summary.data.newCustomers, summary.data.previousNewCustomers)
      : undefined;

  return (
    <AdminLayout
      eyebrow="Insight"
      title="Analytics"
      description="Real revenue, order and product performance — no placeholder data."
      actions={
        <Select value={String(rangeDays)} onValueChange={(v) => setRangeDays(Number(v))}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {summary.status === "error" && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {summary.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summary.status === "loading" &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        {summary.status === "ready" && (
          <>
            <StatCard
              label="Revenue"
              value={formatPrice(summary.data.revenue)}
              delta={revenueDelta?.text}
              trend={revenueDelta?.trend}
              icon={Banknote}
              hint={`Last ${summary.data.rangeDays} days`}
            />
            <StatCard
              label="Orders"
              value={summary.data.orderCount.toLocaleString()}
              delta={orderDelta?.text}
              trend={orderDelta?.trend}
              icon={ShoppingBag}
              hint={`Last ${summary.data.rangeDays} days`}
            />
            <StatCard
              label="Avg Order Value"
              value={formatPrice(summary.data.averageOrderValue)}
              delta={aovDelta?.text}
              trend={aovDelta?.trend}
              icon={TrendingUp}
            />
            <StatCard
              label="New Customers"
              value={summary.data.newCustomers.toLocaleString()}
              delta={customerDelta?.text}
              trend={customerDelta?.trend}
              icon={Users}
              hint={`Last ${summary.data.rangeDays} days`}
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Revenue Trend"
          description={`Daily revenue — last ${Math.min(rangeDays, 30)} days`}
        >
          <RevenueTrendChart state={trend} />
        </SectionCard>
        <SectionCard title="Orders by Status" description={`Last ${rangeDays} days`}>
          <StatusBreakdownList state={statusBreakdown} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Top Products"
          description={`Ranked by revenue — last ${rangeDays} days`}
        >
          <TopProductsList state={topProducts} />
        </SectionCard>
        <SectionCard title="Top Brands" description={`Ranked by revenue — last ${rangeDays} days`}>
          <TopBrandsList state={topBrands} />
        </SectionCard>
      </div>
    </AdminLayout>
  );
}

function RevenueTrendChart({ state }: { state: Load<RevenueTrendPoint[]> }) {
  if (state.status === "loading") return <Skeleton className="h-[260px] w-full rounded-xl" />;
  if (state.status === "error") {
    return <p className="py-10 text-center text-sm text-muted-foreground">{state.message}</p>;
  }
  const hasRevenue = state.data.some((p) => p.revenue > 0);
  if (!hasRevenue) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No revenue yet"
        description="Once orders come in for this period, the daily trend will show up here."
      />
    );
  }

  const max = Math.max(...state.data.map((p) => p.revenue), 1);

  return (
    <div className="flex h-[260px] items-end gap-1.5 overflow-x-auto pb-1">
      {state.data.map((point) => (
        <div
          key={point.date}
          className="flex min-w-[18px] flex-1 flex-col items-center gap-1.5"
          title={`${point.date}: ${formatPrice(point.revenue)}`}
        >
          <div className="flex h-[200px] w-full items-end">
            <div
              className="w-full rounded-t-sm bg-gradient-gold"
              style={{ height: `${Math.max(2, (point.revenue / max) * 100)}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground">
            {new Date(point.date).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusBreakdownList({ state }: { state: Load<OrderStatusCount[]> }) {
  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }
  if (state.status === "error") {
    return <p className="py-6 text-center text-sm text-muted-foreground">{state.message}</p>;
  }
  if (state.data.length === 0) {
    return (
      <EmptyState
        icon={ListTree}
        title="No orders yet"
        description="Order statuses will appear here once orders are placed."
      />
    );
  }

  const max = Math.max(...state.data.map((s) => s.count), 1);

  return (
    <ul className="space-y-4">
      {state.data.map((s) => (
        <li key={s.status}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{ORDER_STATUS_LABELS[s.status] ?? s.status}</span>
            <span className="font-medium text-muted-foreground">{s.count}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-gold"
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function TopProductsList({ state }: { state: Load<TopProductEntry[]> }) {
  if (state.status === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (state.status === "error") {
    return <p className="py-6 text-center text-sm text-muted-foreground">{state.message}</p>;
  }
  if (state.data.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No product sales yet"
        description="Top sellers will show up here once orders come in for this period."
      />
    );
  }

  return (
    <ol className="space-y-3">
      {state.data.map((p, i) => (
        <li
          key={p.name}
          className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-3"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-soft/40 font-serif text-sm text-gold-deep ring-1 ring-gold/40">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{p.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {p.brand ? `${p.brand} · ` : ""}
              {p.unitsSold} sold
            </p>
          </div>
          <span className="font-medium text-foreground">{formatPrice(p.revenue)}</span>
        </li>
      ))}
    </ol>
  );
}

function TopBrandsList({ state }: { state: Load<TopBrandEntry[]> }) {
  if (state.status === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (state.status === "error") {
    return <p className="py-6 text-center text-sm text-muted-foreground">{state.message}</p>;
  }
  if (state.data.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No brand sales yet"
        description="Top brands will show up here once orders come in for this period."
      />
    );
  }

  return (
    <ol className="space-y-3">
      {state.data.map((b, i) => (
        <li
          key={b.brand}
          className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-3"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-soft/40 font-serif text-sm text-gold-deep ring-1 ring-gold/40">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{b.brand}</p>
            <p className="truncate text-xs text-muted-foreground">{b.unitsSold} sold</p>
          </div>
          <span className="font-medium text-foreground">{formatPrice(b.revenue)}</span>
        </li>
      ))}
    </ol>
  );
}
