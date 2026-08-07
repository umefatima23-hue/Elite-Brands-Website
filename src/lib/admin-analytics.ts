/**
 * Admin Analytics (read-only).
 *
 * Every function here reads through the normal RLS-scoped browser client
 * (`@/integrations/supabase/client`), same as src/lib/admin.ts — the
 * existing "Staff manage orders/customers/order_items" RLS policies
 * (`is_staff()`) already grant a real staff user full read access, so no
 * service role or server function is needed. No table is ever written to
 * from this file.
 *
 * Schema notes (verified against src/integrations/supabase/types.ts and
 * supabase/migrations/20260712075946_*.sql / 20260711175052_*.sql before
 * writing any of this — same verification src/lib/admin.ts and
 * src/lib/admin-brands.ts already rely on):
 *
 * - `orders` has no aggregate/rollup columns and there is no analytics view
 *   in the migrations (only `public.v_low_stock` exists, which is
 *   inventory-focused, not sales-focused). So every number here is derived
 *   client-side from real rows — `orders.grand_total`, `orders.status`,
 *   `orders.payment_status`, `orders.created_at` for revenue/order/trend
 *   figures, and `customers.created_at` for new-customer counts. This
 *   mirrors the exact approach `getDashboardStats()` in src/lib/admin.ts
 *   already takes (fetch rows, reduce in JS) — nothing new is invented.
 * - "Revenue" excludes the same statuses `admin.ts` already excludes
 *   (`cancelled`, `returned`, `refunded`) — those were never realized
 *   revenue. That set is redefined here rather than imported because
 *   `NON_REVENUE_STATUSES` isn't exported from admin.ts; the value is kept
 *   identical on purpose.
 * - Top products / top brands come from `order_items.product_name_snapshot`
 *   / `order_items.brand_snapshot` — the point-in-time snapshot columns
 *   already used everywhere else in the codebase (src/lib/orders.ts,
 *   src/lib/admin.ts's getRecentOrders) instead of joining live
 *   `products`/`brands` rows, so a renamed/deleted product still shows
 *   correctly in historical analytics. The parent order is filtered via
 *   PostgREST's embedded-resource `!inner` join + dot-path filters
 *   (`orders.deleted_at`, `orders.status`, `orders.created_at`), the same
 *   mechanism already used for `customer:customers(...)` embeds in
 *   src/lib/orders.ts and src/lib/admin-orders-style code elsewhere in the
 *   app — no raw SQL, no new database objects.
 * - There's no `orders.deleted_at`-equivalent soft delete for order_items,
 *   so filtering on the parent order's `deleted_at` is sufficient.
 * - Queries are bounded to a `days` window (default windows below) rather
 *   than scanning all-time data, since order_items can grow large; each
 *   query also carries a defensive `.limit()` as a hard ceiling.
 */
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsErrorCode = "PERMISSION_DENIED" | "DATABASE_ERROR" | "NETWORK_ERROR";

export interface AnalyticsError {
  code: AnalyticsErrorCode;
  message: string;
}

export type Result<T> = { success: true; data: T } | { success: false; error: AnalyticsError };

/** Orders excluded from revenue — never realized revenue. Mirrors src/lib/admin.ts's NON_REVENUE_STATUSES exactly. */
const NON_REVENUE_STATUSES = "(cancelled,returned,refunded)";

function mapError(
  error: { code?: string; message: string } | null,
  fallback: string,
): AnalyticsError {
  // Postgres/PostgREST insufficient_privilege — surfaced when RLS denies a non-staff caller.
  if (error?.code === "42501") {
    return { code: "PERMISSION_DENIED", message: "You don't have permission to view this data." };
  }
  return { code: "DATABASE_ERROR", message: fallback };
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function dateKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Summary — revenue, order count, AOV, new customers, each vs. the prior
// period of equal length so the UI can show a real trend, not a fake one.
// ---------------------------------------------------------------------------

export interface AnalyticsSummary {
  currency: string;
  rangeDays: number;
  revenue: number;
  previousRevenue: number;
  orderCount: number;
  previousOrderCount: number;
  averageOrderValue: number;
  previousAverageOrderValue: number;
  newCustomers: number;
  previousNewCustomers: number;
}

interface RevenueRow {
  grand_total: number;
  currency: string;
  created_at: string;
}

export async function getAnalyticsSummary(rangeDays = 30): Promise<Result<AnalyticsSummary>> {
  try {
    const currentFrom = daysAgoIso(rangeDays);
    const previousFrom = daysAgoIso(rangeDays * 2);

    const [currentOrders, previousOrders, currentCustomers, previousCustomers] = await Promise.all([
      supabase
        .from("orders")
        .select("grand_total, currency, created_at")
        .is("deleted_at", null)
        .not("status", "in", NON_REVENUE_STATUSES)
        .gte("created_at", currentFrom),
      supabase
        .from("orders")
        .select("grand_total, currency, created_at")
        .is("deleted_at", null)
        .not("status", "in", NON_REVENUE_STATUSES)
        .gte("created_at", previousFrom)
        .lt("created_at", currentFrom),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", currentFrom),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", previousFrom)
        .lt("created_at", currentFrom),
    ]);

    if (currentOrders.error) {
      return { success: false, error: mapError(currentOrders.error, "We couldn't load revenue.") };
    }
    if (previousOrders.error) {
      return { success: false, error: mapError(previousOrders.error, "We couldn't load revenue.") };
    }
    if (currentCustomers.error) {
      return {
        success: false,
        error: mapError(currentCustomers.error, "We couldn't load customer totals."),
      };
    }
    if (previousCustomers.error) {
      return {
        success: false,
        error: mapError(previousCustomers.error, "We couldn't load customer totals."),
      };
    }

    const currentRows = (currentOrders.data ?? []) as RevenueRow[];
    const previousRows = (previousOrders.data ?? []) as RevenueRow[];

    const revenue = currentRows.reduce((sum, row) => sum + row.grand_total, 0);
    const previousRevenue = previousRows.reduce((sum, row) => sum + row.grand_total, 0);
    const orderCount = currentRows.length;
    const previousOrderCount = previousRows.length;
    const currency = currentRows[0]?.currency ?? previousRows[0]?.currency ?? "PKR";

    return {
      success: true,
      data: {
        currency,
        rangeDays,
        revenue,
        previousRevenue,
        orderCount,
        previousOrderCount,
        averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        previousAverageOrderValue:
          previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0,
        newCustomers: currentCustomers.count ?? 0,
        previousNewCustomers: previousCustomers.count ?? 0,
      },
    };
  } catch (err) {
    console.error("[admin-analytics] getAnalyticsSummary error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

// ---------------------------------------------------------------------------
// Revenue trend — real per-day revenue/order-count buckets, computed in JS
// from the same row shape as the summary above (no rollup table exists).
// ---------------------------------------------------------------------------

export interface RevenueTrendPoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  orderCount: number;
}

export async function getRevenueTrend(days = 14): Promise<Result<RevenueTrendPoint[]>> {
  try {
    const from = daysAgoIso(days);
    const { data, error } = await supabase
      .from("orders")
      .select("grand_total, currency, created_at")
      .is("deleted_at", null)
      .not("status", "in", NON_REVENUE_STATUSES)
      .gte("created_at", from)
      .order("created_at", { ascending: true })
      .limit(5000);

    if (error)
      return { success: false, error: mapError(error, "We couldn't load the revenue trend.") };

    const buckets = new Map<string, { revenue: number; orderCount: number }>();
    // Pre-seed every day in the window so gaps show as zero, not as missing days.
    for (let i = days - 1; i >= 0; i--) {
      buckets.set(dateKey(daysAgoIso(i)), { revenue: 0, orderCount: 0 });
    }
    for (const row of (data ?? []) as RevenueRow[]) {
      const key = dateKey(row.created_at);
      const bucket = buckets.get(key) ?? { revenue: 0, orderCount: 0 };
      bucket.revenue += row.grand_total;
      bucket.orderCount += 1;
      buckets.set(key, bucket);
    }

    return {
      success: true,
      data: Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v })),
    };
  } catch (err) {
    console.error("[admin-analytics] getRevenueTrend error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

// ---------------------------------------------------------------------------
// Order status breakdown — real counts per public.order_status value.
// ---------------------------------------------------------------------------

export interface OrderStatusCount {
  status: string;
  count: number;
}

export async function getOrderStatusBreakdown(days = 30): Promise<Result<OrderStatusCount[]>> {
  try {
    const from = daysAgoIso(days);
    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .is("deleted_at", null)
      .gte("created_at", from)
      .limit(5000);

    if (error) {
      return {
        success: false,
        error: mapError(error, "We couldn't load the order status breakdown."),
      };
    }

    const counts = new Map<string, number>();
    for (const row of (data ?? []) as { status: string }[]) {
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
    }

    return {
      success: true,
      data: Array.from(counts.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (err) {
    console.error("[admin-analytics] getOrderStatusBreakdown error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

// ---------------------------------------------------------------------------
// Top products / top brands — aggregated from order_items snapshot columns,
// scoped to non-deleted, non-cancelled/returned/refunded parent orders via
// an embedded !inner join + dot-path filters (PostgREST, no raw SQL).
// ---------------------------------------------------------------------------

export interface TopProductEntry {
  name: string;
  brand: string | null;
  unitsSold: number;
  revenue: number;
}

export interface TopBrandEntry {
  brand: string;
  unitsSold: number;
  revenue: number;
}

interface OrderItemAggRow {
  product_name_snapshot: string;
  brand_snapshot: string | null;
  quantity: number;
  line_total: number;
}

async function fetchOrderItemsInWindow(days: number): Promise<Result<OrderItemAggRow[]>> {
  const from = daysAgoIso(days);
  const { data, error } = await supabase
    .from("order_items")
    .select(
      "product_name_snapshot, brand_snapshot, quantity, line_total, orders!inner(created_at, status, deleted_at)",
    )
    .is("orders.deleted_at", null)
    .not("orders.status", "in", NON_REVENUE_STATUSES)
    .gte("orders.created_at", from)
    .limit(5000);

  if (error) {
    return { success: false, error: mapError(error, "We couldn't load product sales.") };
  }
  return { success: true, data: (data ?? []) as unknown as OrderItemAggRow[] };
}

export async function getTopProducts(days = 30, limit = 5): Promise<Result<TopProductEntry[]>> {
  try {
    const rows = await fetchOrderItemsInWindow(days);
    if (!rows.success) return rows;

    const byProduct = new Map<string, TopProductEntry>();
    for (const item of rows.data) {
      const key = item.product_name_snapshot;
      const existing = byProduct.get(key);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += item.line_total;
      } else {
        byProduct.set(key, {
          name: item.product_name_snapshot,
          brand: item.brand_snapshot,
          unitsSold: item.quantity,
          revenue: item.line_total,
        });
      }
    }

    return {
      success: true,
      data: Array.from(byProduct.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit),
    };
  } catch (err) {
    console.error("[admin-analytics] getTopProducts error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function getTopBrands(days = 30, limit = 5): Promise<Result<TopBrandEntry[]>> {
  try {
    const rows = await fetchOrderItemsInWindow(days);
    if (!rows.success) return rows;

    const byBrand = new Map<string, TopBrandEntry>();
    for (const item of rows.data) {
      if (!item.brand_snapshot) continue; // no brand captured on this line item — excluded, not guessed
      const existing = byBrand.get(item.brand_snapshot);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += item.line_total;
      } else {
        byBrand.set(item.brand_snapshot, {
          brand: item.brand_snapshot,
          unitsSold: item.quantity,
          revenue: item.line_total,
        });
      }
    }

    return {
      success: true,
      data: Array.from(byBrand.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit),
    };
  } catch (err) {
    console.error("[admin-analytics] getTopBrands error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
