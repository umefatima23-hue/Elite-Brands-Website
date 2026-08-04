/**
 * Admin dashboard data service.
 *
 * All three functions read through the normal RLS-scoped browser client
 * (`@/integrations/supabase/client`), not the service-role admin client.
 * That's deliberate: the existing "Staff manage orders/customers/..." RLS
 * policies (`is_staff()`) already grant a real staff user full read access,
 * so no service role or server function is needed for read-only dashboard
 * data — only writes need that (see src/lib/orders.ts for why).
 *
 * Every function returns a typed result rather than throwing, and never
 * surfaces a raw Supabase/Postgres error to the caller.
 */
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
  currency: string;
}

export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  contactName: string | null;
  status: string;
  grandTotal: number;
  currency: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  originalPrice: number;
  salePrice: number | null;
}

export type AdminErrorCode = "PERMISSION_DENIED" | "DATABASE_ERROR" | "NETWORK_ERROR";

export interface AdminError {
  code: AdminErrorCode;
  message: string;
}

export type GetDashboardStatsResult =
  | { success: true; stats: DashboardStats }
  | { success: false; error: AdminError };

export type GetRecentOrdersResult =
  | { success: true; orders: RecentOrderSummary[] }
  | { success: false; error: AdminError };

export type GetLowStockProductsResult =
  | { success: true; products: LowStockProduct[] }
  | { success: false; error: AdminError };

/** Orders excluded from the revenue total — cancelled/returned/refunded orders were never realized revenue. */
const NON_REVENUE_STATUSES = "(cancelled,returned,refunded)";

function mapError(
  error: { code?: string; message: string } | null,
  fallbackMessage: string,
): AdminError {
  // Postgres/PostgREST insufficient_privilege — surfaced when RLS denies a non-staff caller.
  if (error?.code === "42501") {
    return {
      code: "PERMISSION_DENIED",
      message: "You don't have permission to view this data.",
    };
  }
  return { code: "DATABASE_ERROR", message: fallbackMessage };
}

export async function getDashboardStats(): Promise<GetDashboardStatsResult> {
  try {
    const [ordersCount, productsCount, customersCount, revenueRows] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("orders")
        .select("grand_total, currency")
        .is("deleted_at", null)
        .not("status", "in", NON_REVENUE_STATUSES),
    ]);

    if (ordersCount.error) {
      return {
        success: false,
        error: mapError(ordersCount.error, "We couldn't load order totals."),
      };
    }
    if (productsCount.error) {
      return {
        success: false,
        error: mapError(productsCount.error, "We couldn't load product totals."),
      };
    }
    if (customersCount.error) {
      return {
        success: false,
        error: mapError(customersCount.error, "We couldn't load customer totals."),
      };
    }
    if (revenueRows.error) {
      return { success: false, error: mapError(revenueRows.error, "We couldn't load revenue.") };
    }

    const revenue = (revenueRows.data ?? []).reduce((sum, row) => sum + row.grand_total, 0);
    const currency = revenueRows.data?.[0]?.currency ?? "PKR";

    return {
      success: true,
      stats: {
        totalOrders: ordersCount.count ?? 0,
        totalProducts: productsCount.count ?? 0,
        totalCustomers: customersCount.count ?? 0,
        revenue,
        currency,
      },
    };
  } catch (err) {
    console.error("[admin] getDashboardStats unexpected error:", err);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Something went wrong loading the dashboard. Please try again.",
      },
    };
  }
}

export async function getRecentOrders(limit = 5): Promise<GetRecentOrdersResult> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, contact_name, status, grand_total, currency, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: mapError(error, "We couldn't load recent orders.") };
    }

    return {
      success: true,
      orders: (data ?? []).map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        contactName: row.contact_name,
        status: row.status,
        grandTotal: row.grand_total,
        currency: row.currency,
        createdAt: row.created_at,
      })),
    };
  } catch (err) {
    console.error("[admin] getRecentOrders unexpected error:", err);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Something went wrong loading recent orders. Please try again.",
      },
    };
  }
}

/** "Low stock" uses the existing `products.is_limited_stock` flag rather than joining the variant/warehouse-scoped `inventory` table — same pragmatic simplification used in src/lib/catalog.ts's inStock mapping. */
export async function getLowStockProducts(limit = 10): Promise<GetLowStockProductsResult> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, original_price, sale_price")
      .eq("is_limited_stock", true)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: mapError(error, "We couldn't load low-stock products.") };
    }

    return {
      success: true,
      products: (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        originalPrice: row.original_price,
        salePrice: row.sale_price,
      })),
    };
  } catch (err) {
    console.error("[admin] getLowStockProducts unexpected error:", err);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Something went wrong loading low-stock products. Please try again.",
      },
    };
  }
}
