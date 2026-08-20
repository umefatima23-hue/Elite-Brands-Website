/**
 * Admin Orders (read-only).
 *
 * Scope: list + detail views for staff only. No create/update/delete here —
 * order mutation (status transitions, payment capture, etc.) is intentionally
 * out of scope for this module and lives elsewhere when it's built.
 *
 * Schema notes (verified against src/integrations/supabase/types.ts and
 * supabase/migrations/20260712075946_*.sql before writing any of this):
 *
 * - `orders.status` (public.order_status) already models the shipping
 *   lifecycle end-to-end: draft → pending → confirmed → packing →
 *   ready_to_dispatch → dispatched → delivered, with cancelled / returned /
 *   refunded as terminal branches. There is no separate "shipping_status"
 *   column — this module treats `status` as the shipping status, same as
 *   the rest of the schema does (see `confirmed_at` / `packed_at` /
 *   `dispatched_at` / `delivered_at` timestamp columns, which stamp the
 *   same lifecycle).
 * - `orders.payment_status` (public.payment_status) is separate and tracked
 *   independently, since COD orders ship before they're paid.
 * - RLS: "Staff manage orders" / "Staff manage order items" grant staff
 *   roles (`is_staff()`) full read access via the normal RLS-scoped browser
 *   client — same reasoning as src/lib/admin.ts, no service role needed for
 *   reads.
 * - `order_events` is the append-only timeline table. "Staff view events"
 *   lets staff see every event including internal (`is_internal`) ones,
 *   unlike the customer-facing policy which filters those out.
 * - Order search matches `order_number`, `contact_name`, `contact_phone`,
 *   and `contact_email` — the columns a staff member would actually have on
 *   hand when a customer calls in about an order.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const ORDER_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "packing",
  "ready_to_dispatch",
  "dispatched",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
  "cod_pending",
  "partially_paid",
] as const;
export type PaymentStatusValue = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = [
  "cod",
  "bank_transfer",
  "card",
  "whatsapp",
  "wallet",
  "other",
] as const;
export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number];

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatusValue;
  paymentStatus: PaymentStatusValue;
  paymentMethod: PaymentMethodValue;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  grandTotal: number;
  currency: string;
  orderSource: Database["public"]["Enums"]["order_source_enum"];
  createdAt: string;
}

export interface AdminOrderCustomerSummary {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: Database["public"]["Enums"]["customer_status"];
  lifetimeOrdersCount: number;
  lifetimeSpend: number;
  lastOrderAt: string | null;
}

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  skuSnapshot: string;
  name: string;
  variantName: string | null;
  brand: string | null;
  imageSnapshot: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface AdminOrderEvent {
  id: string;
  eventType: string;
  fromStatus: OrderStatusValue | null;
  toStatus: OrderStatusValue | null;
  message: string | null;
  isInternal: boolean;
  createdAt: string;
}

export interface AdminOrderDetail extends AdminOrderListItem {
  isCod: boolean;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  customerNotes: string | null;
  internalNotes: string | null;
  cancellationReason: string | null;
  returnReason: string | null;
  confirmedAt: string | null;
  packedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  returnedAt: string | null;
  refundedAt: string | null;
  updatedAt: string;
  customer: AdminOrderCustomerSummary | null;
  items: AdminOrderItem[];
  events: AdminOrderEvent[];
}

export type AdminOrdersErrorCode =
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

export interface AdminOrdersError {
  code: AdminOrdersErrorCode;
  message: string;
}

export type Result<T> = { success: true; data: T } | { success: false; error: AdminOrdersError };

function mapError(
  error: { code?: string; message: string } | null,
  fallback: string,
): AdminOrdersError {
  // Postgres/PostgREST insufficient_privilege — surfaced when RLS denies a non-staff caller.
  if (error?.code === "42501") {
    return { code: "PERMISSION_DENIED", message: "You don't have permission to view this data." };
  }
  return { code: "DATABASE_ERROR", message: fallback };
}

// ---- Row shapes (subset of generated types, as actually selected) ----

interface OrderListRow {
  id: string;
  order_number: string;
  status: OrderStatusValue;
  payment_status: PaymentStatusValue;
  payment_method: PaymentMethodValue;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  grand_total: number;
  currency: string;
  order_source: Database["public"]["Enums"]["order_source_enum"];
  created_at: string;
}

function mapOrderListRow(row: OrderListRow): AdminOrderListItem {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email,
    grandTotal: row.grand_total,
    currency: row.currency,
    orderSource: row.order_source,
    createdAt: row.created_at,
  };
}

const ORDER_LIST_SELECT =
  "id, order_number, status, payment_status, payment_method, contact_name, contact_phone, contact_email, grand_total, currency, order_source, created_at";

export interface ListOrdersParams {
  search?: string;
  status?: OrderStatusValue | "all";
  paymentStatus?: PaymentStatusValue | "all";
  page: number;
  pageSize: number;
}

/** Admin order list — search, status/payment filters, pagination. Staff-only via RLS. */
export async function listOrdersAdmin(
  params: ListOrdersParams,
): Promise<Result<{ items: AdminOrderListItem[]; total: number }>> {
  try {
    const from = (params.page - 1) * params.pageSize;
    let query = supabase
      .from("orders")
      .select(ORDER_LIST_SELECT, { count: "exact" })
      .is("deleted_at", null);

    if (params.search) {
      const term = params.search.replace(/[,()%]/g, " ").trim();
      if (term) {
        query = query.or(
          [
            `order_number.ilike.%${term}%`,
            `contact_name.ilike.%${term}%`,
            `contact_phone.ilike.%${term}%`,
            `contact_email.ilike.%${term}%`,
          ].join(","),
        );
      }
    }
    if (params.status && params.status !== "all") query = query.eq("status", params.status);
    if (params.paymentStatus && params.paymentStatus !== "all") {
      query = query.eq("payment_status", params.paymentStatus);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, from + params.pageSize - 1);

    if (error) return { success: false, error: mapError(error, "We couldn't load orders.") };

    return {
      success: true,
      data: { items: (data as unknown as OrderListRow[]).map(mapOrderListRow), total: count ?? 0 },
    };
  } catch (err) {
    console.error("[admin-orders] listOrdersAdmin error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

interface CustomerEmbedRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: Database["public"]["Enums"]["customer_status"];
  lifetime_orders_count: number;
  lifetime_spend: number;
  last_order_at: string | null;
}

interface OrderItemEmbedRow {
  id: string;
  product_id: string | null;
  sku_snapshot: string;
  product_name_snapshot: string;
  variant_name_snapshot: string | null;
  brand_snapshot: string | null;
  image_snapshot: string | null;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
}

interface OrderEventEmbedRow {
  id: string;
  event_type: string;
  from_status: OrderStatusValue | null;
  to_status: OrderStatusValue | null;
  message: string | null;
  is_internal: boolean;
  created_at: string;
}

interface OrderDetailRow extends OrderListRow {
  is_cod: boolean;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  shipping_address: unknown;
  billing_address: unknown;
  customer_notes: string | null;
  internal_notes: string | null;
  cancellation_reason: string | null;
  return_reason: string | null;
  confirmed_at: string | null;
  packed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  returned_at: string | null;
  refunded_at: string | null;
  updated_at: string;
  customer: CustomerEmbedRow | null;
  items: OrderItemEmbedRow[] | null;
  events: OrderEventEmbedRow[] | null;
}

function asAddress(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function mapOrderDetailRow(row: OrderDetailRow): AdminOrderDetail {
  return {
    ...mapOrderListRow(row),
    isCod: row.is_cod,
    subtotal: row.subtotal,
    discountTotal: row.discount_total,
    shippingTotal: row.shipping_total,
    taxTotal: row.tax_total,
    shippingAddress: asAddress(row.shipping_address),
    billingAddress: asAddress(row.billing_address),
    customerNotes: row.customer_notes,
    internalNotes: row.internal_notes,
    cancellationReason: row.cancellation_reason,
    returnReason: row.return_reason,
    confirmedAt: row.confirmed_at,
    packedAt: row.packed_at,
    dispatchedAt: row.dispatched_at,
    deliveredAt: row.delivered_at,
    cancelledAt: row.cancelled_at,
    returnedAt: row.returned_at,
    refundedAt: row.refunded_at,
    updatedAt: row.updated_at,
    customer: row.customer
      ? {
          id: row.customer.id,
          fullName: row.customer.full_name,
          email: row.customer.email,
          phone: row.customer.phone,
          whatsapp: row.customer.whatsapp,
          status: row.customer.status,
          lifetimeOrdersCount: row.customer.lifetime_orders_count,
          lifetimeSpend: row.customer.lifetime_spend,
          lastOrderAt: row.customer.last_order_at,
        }
      : null,
    items: (row.items ?? []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      skuSnapshot: item.sku_snapshot,
      name: item.product_name_snapshot,
      variantName: item.variant_name_snapshot,
      brand: item.brand_snapshot,
      imageSnapshot: item.image_snapshot,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      discountAmount: item.discount_amount,
      taxAmount: item.tax_amount,
      lineTotal: item.line_total,
    })),
    events: (row.events ?? [])
      .map((event) => ({
        id: event.id,
        eventType: event.event_type,
        fromStatus: event.from_status,
        toStatus: event.to_status,
        message: event.message,
        isInternal: event.is_internal,
        createdAt: event.created_at,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

const ORDER_DETAIL_SELECT = `
  ${ORDER_LIST_SELECT},
  is_cod, subtotal, discount_total, shipping_total, tax_total,
  shipping_address, billing_address, customer_notes, internal_notes,
  cancellation_reason, return_reason,
  confirmed_at, packed_at, dispatched_at, delivered_at, cancelled_at, returned_at, refunded_at,
  updated_at,
  customer:customers(id, full_name, email, phone, whatsapp, status, lifetime_orders_count, lifetime_spend, last_order_at),
  items:order_items(id, product_id, sku_snapshot, product_name_snapshot, variant_name_snapshot, brand_snapshot, image_snapshot, quantity, unit_price, discount_amount, tax_amount, line_total),
  events:order_events(id, event_type, from_status, to_status, message, is_internal, created_at)
`;

/** Full read-only order detail: customer summary, line items, and the event timeline. Staff-only via RLS. */
export async function getOrderAdmin(id: string): Promise<Result<AdminOrderDetail>> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_DETAIL_SELECT)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) return { success: false, error: mapError(error, "We couldn't load that order.") };
    if (!data) return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };

    return { success: true, data: mapOrderDetailRow(data as unknown as OrderDetailRow) };
  } catch (err) {
    console.error("[admin-orders] getOrderAdmin error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
