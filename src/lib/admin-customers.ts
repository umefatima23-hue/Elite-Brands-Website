/**
 * Admin Customers.
 *
 * Schema notes (verified against src/integrations/supabase/types.ts and the
 * migrations before writing any of this):
 *
 * - `customers` already carries precomputed `lifetime_orders_count`,
 *   `lifetime_spend`, and `last_order_at` (trigger-maintained elsewhere in
 *   the schema) — statistics here read these directly rather than
 *   aggregating `orders` client-side.
 * - RLS: `"Staff manage customers"` is a permissive `FOR ALL` policy
 *   (`is_staff()`), so staff can INSERT/UPDATE/SELECT directly via the
 *   browser client — no service role needed. `"Only super_admin hard
 *   delete customers"` is a RESTRICTIVE policy layered on top of that,
 *   scoped to DELETE only, so hard delete is super_admin-only — same
 *   pattern as products/brands/categories. Soft delete (`deleted_at`) via
 *   UPDATE is therefore the correct "delete" for any staff role, and
 *   restore simply clears it — also an UPDATE, also staff-permitted.
 * - No "create customer" here on purpose — customers are created via
 *   checkout/auth, not by admins; only listed in the task as Management,
 *   Detail, search/filters/stats/pagination/soft-delete/restore.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const CUSTOMER_STATUSES = ["active", "inactive", "blocked", "archived"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CONTACT_METHODS = ["whatsapp", "phone", "email", "sms"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export interface AdminCustomerListItem {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
  lifetimeOrdersCount: number;
  lifetimeSpend: number;
  lastOrderAt: string | null;
  deletedAt: string | null;
  createdAt: string;
}

export interface AdminCustomerDetail extends AdminCustomerListItem {
  whatsapp: string | null;
  marketingOptIn: boolean;
  preferredContactMethod: ContactMethod;
  tags: string[];
  internalNotes: string;
  updatedAt: string;
}

export interface CustomerNotesInput {
  status: CustomerStatus;
  internalNotes: string;
  tags: string[];
  marketingOptIn: boolean;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: number;
  currency: string;
  createdAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  totalLifetimeSpend: number;
  currency: string;
}

export type AdminOpErrorCode =
  | "VALIDATION_ERROR"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

export interface AdminOpError {
  code: AdminOpErrorCode;
  message: string;
}

export type Result<T> = { success: true; data: T } | { success: false; error: AdminOpError };

function mapError(
  error: { code?: string; message: string } | null,
  fallback: string,
): AdminOpError {
  if (error?.code === "42501") {
    return { code: "PERMISSION_DENIED", message: "You don't have permission to do this." };
  }
  return { code: "DATABASE_ERROR", message: fallback };
}

interface CustomerRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: CustomerStatus;
  lifetime_orders_count: number;
  lifetime_spend: number;
  last_order_at: string | null;
  marketing_opt_in: boolean;
  preferred_contact_method: ContactMethod;
  tags: string[];
  internal_notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const LIST_SELECT =
  "id, full_name, email, phone, status, lifetime_orders_count, lifetime_spend, last_order_at, deleted_at, created_at";

const DETAIL_SELECT = `${LIST_SELECT}, whatsapp, marketing_opt_in, preferred_contact_method, tags, internal_notes, updated_at`;

function mapListRow(row: CustomerRow): AdminCustomerListItem {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    lifetimeOrdersCount: row.lifetime_orders_count,
    lifetimeSpend: row.lifetime_spend,
    lastOrderAt: row.last_order_at,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
  };
}

function mapDetailRow(row: CustomerRow): AdminCustomerDetail {
  return {
    ...mapListRow(row),
    whatsapp: row.whatsapp,
    marketingOptIn: row.marketing_opt_in,
    preferredContactMethod: row.preferred_contact_method,
    tags: row.tags ?? [],
    internalNotes: row.internal_notes ?? "",
    updatedAt: row.updated_at,
  };
}

export interface ListCustomersParams {
  search?: string;
  status?: CustomerStatus | "all";
  includeDeleted?: boolean;
  page: number;
  pageSize: number;
}

export async function listCustomersAdmin(
  params: ListCustomersParams,
): Promise<Result<{ items: AdminCustomerListItem[]; total: number }>> {
  try {
    const from = (params.page - 1) * params.pageSize;
    let query = supabase.from("customers").select(LIST_SELECT, { count: "exact" });

    if (!params.includeDeleted) query = query.is("deleted_at", null);
    if (params.search) {
      const term = params.search.replace(/[,()%]/g, " ").trim();
      if (term)
        query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
    }
    if (params.status && params.status !== "all") query = query.eq("status", params.status);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, from + params.pageSize - 1);

    if (error) return { success: false, error: mapError(error, "We couldn't load customers.") };

    return {
      success: true,
      data: { items: (data as unknown as CustomerRow[]).map(mapListRow), total: count ?? 0 },
    };
  } catch (err) {
    console.error("[admin-customers] listCustomersAdmin error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function getCustomer(id: string): Promise<Result<AdminCustomerDetail>> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select(DETAIL_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) return { success: false, error: mapError(error, "We couldn't load that customer.") };
    if (!data)
      return { success: false, error: { code: "NOT_FOUND", message: "Customer not found." } };
    return { success: true, data: mapDetailRow(data as unknown as CustomerRow) };
  } catch (err) {
    console.error("[admin-customers] getCustomer error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

/** Order history for the Customer Detail page. RLS ("Staff manage orders") already scopes this correctly for a staff caller. */
export async function getCustomerOrders(
  customerId: string,
  limit = 10,
): Promise<Result<CustomerOrderSummary[]>> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, grand_total, currency, created_at")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error)
      return { success: false, error: mapError(error, "We couldn't load this customer's orders.") };

    return {
      success: true,
      data: (data ?? []).map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        status: row.status,
        grandTotal: row.grand_total,
        currency: row.currency,
        createdAt: row.created_at,
      })),
    };
  } catch (err) {
    console.error("[admin-customers] getCustomerOrders error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function getCustomerStats(): Promise<Result<CustomerStats>> {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalCount, activeCount, newThisMonthCount, spendRows] = await Promise.all([
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("status", "active"),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", startOfMonth.toISOString()),
      supabase.from("customers").select("lifetime_spend").is("deleted_at", null),
    ]);

    if (totalCount.error)
      return {
        success: false,
        error: mapError(totalCount.error, "We couldn't load customer totals."),
      };
    if (activeCount.error)
      return {
        success: false,
        error: mapError(activeCount.error, "We couldn't load customer totals."),
      };
    if (newThisMonthCount.error) {
      return {
        success: false,
        error: mapError(newThisMonthCount.error, "We couldn't load customer totals."),
      };
    }
    if (spendRows.error)
      return {
        success: false,
        error: mapError(spendRows.error, "We couldn't load customer totals."),
      };

    const totalLifetimeSpend = (spendRows.data ?? []).reduce(
      (sum, row) => sum + row.lifetime_spend,
      0,
    );

    return {
      success: true,
      data: {
        totalCustomers: totalCount.count ?? 0,
        activeCustomers: activeCount.count ?? 0,
        newThisMonth: newThisMonthCount.count ?? 0,
        totalLifetimeSpend,
        currency: "PKR",
      },
    };
  } catch (err) {
    console.error("[admin-customers] getCustomerStats error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function updateCustomerNotes(
  id: string,
  input: CustomerNotesInput,
): Promise<Result<{ id: string }>> {
  try {
    const update: Database["public"]["Tables"]["customers"]["Update"] = {
      status: input.status,
      internal_notes: input.internalNotes || null,
      tags: input.tags,
      marketing_opt_in: input.marketingOptIn,
    };
    const { error } = await supabase.from("customers").update(update).eq("id", id);
    if (error) return { success: false, error: mapError(error, "We couldn't save that customer.") };
    return { success: true, data: { id } };
  } catch (err) {
    console.error("[admin-customers] updateCustomerNotes error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function deleteCustomer(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase
      .from("customers")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error)
      return { success: false, error: mapError(error, "We couldn't delete that customer.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-customers] deleteCustomer error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function restoreCustomer(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase.from("customers").update({ deleted_at: null }).eq("id", id);
    if (error)
      return { success: false, error: mapError(error, "We couldn't restore that customer.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-customers] restoreCustomer error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
