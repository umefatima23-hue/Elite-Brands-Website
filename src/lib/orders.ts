/**
 * Order persistence service.
 *
 * IMPORTANT SCHEMA CONSTRAINT (do not "fix" by relaxing this):
 * RLS on `orders`, `order_items`, and `customers` only grants row access to
 * staff (`is_staff()`) for writes, plus "view own" SELECT policies for
 * customers reading their own data. There is no policy allowing a regular
 * customer — guest or authenticated — to INSERT directly. That's enforced
 * intentionally by the schema (orders must be written through a trusted,
 * server-validated path, never trusted client input). So:
 *
 * - Writes (`createOrder`) run inside a TanStack Start server function using
 *   `supabaseAdmin` (service role, bypasses RLS) — never exposed to the
 *   client bundle. Prices are re-derived from the `products` table
 *   server-side wherever possible, so a tampered client price can't reach
 *   the database.
 * - Authenticated reads (`getOrder`, `getOrdersByUser`) go through the
 *   normal RLS-scoped browser client — the existing "Customers view own
 *   orders/order items" policies already restrict results to the caller's
 *   own data, so no server function is needed for those.
 * - Guest reads (`getGuestOrder`) have no RLS path at all (guests aren't
 *   even granted table access), so they also run through a server function,
 *   with the order's contact email/phone checked against the caller's input
 *   before any data is returned.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// ---- Public types ----

export interface OrderCustomerInput {
  fullName: string;
  email?: string;
  phone: string;
}

export interface OrderShippingInput {
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItemInput {
  productId: string;
  name: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  customer: OrderCustomerInput;
  shipping: OrderShippingInput;
  items: OrderItemInput[];
  /** Optional client-generated key so a resubmitted/duplicated request returns the original order instead of creating a second one. */
  idempotencyKey?: string;
}

export type OrderErrorCode =
  | "EMPTY_CART"
  | "INVALID_QUANTITY"
  | "INVALID_PRICE"
  | "INVALID_TOTAL"
  | "MISSING_CUSTOMER_INFO"
  | "MISSING_SHIPPING_INFO"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

export interface OrderError {
  code: OrderErrorCode;
  message: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: number;
  currency: string;
  createdAt: string;
}

export interface OrderItemSummary {
  id: string;
  productId: string | null;
  name: string;
  brand: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDetail extends OrderSummary {
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  subtotal: number;
  shippingTotal: number;
  items: OrderItemSummary[];
}

export type CreateOrderResult =
  | { success: true; order: OrderSummary }
  | { success: false; error: OrderError };

export type GetOrderResult =
  | { success: true; order: OrderDetail }
  | { success: false; error: OrderError };

export type GetOrdersByUserResult =
  | { success: true; orders: OrderSummary[] }
  | { success: false; error: OrderError };

// ---- Shared constants (mirrors the free-shipping rule already hardcoded in checkout.tsx) ----

const SHIPPING_FREE_THRESHOLD = 5000;
const SHIPPING_FEE = 250;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---- Validation ----

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateCreateOrderInput(input: CreateOrderInput): OrderError | null {
  if (!input.items || input.items.length === 0) {
    return { code: "EMPTY_CART", message: "Your cart is empty." };
  }
  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { code: "INVALID_QUANTITY", message: `"${item.name}" has an invalid quantity.` };
    }
    if (!Number.isFinite(item.unitPrice) || item.unitPrice <= 0) {
      return { code: "INVALID_PRICE", message: `"${item.name}" has an invalid price.` };
    }
  }
  if (!isNonEmptyString(input.customer.fullName) || !isNonEmptyString(input.customer.phone)) {
    return {
      code: "MISSING_CUSTOMER_INFO",
      message: "Full name and phone number are required.",
    };
  }
  if (!isNonEmptyString(input.shipping.address) || !isNonEmptyString(input.shipping.city)) {
    return {
      code: "MISSING_SHIPPING_INFO",
      message: "Shipping address and city are required.",
    };
  }
  return null;
}

// ---- Row shapes (subset of generated types, as actually selected) ----

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  grand_total: number;
  currency: string;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  product_id: string | null;
  product_name_snapshot: string;
  brand_snapshot: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface OrderDetailRow extends OrderRow {
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  subtotal: number;
  shipping_total: number;
  items: OrderItemRow[] | null;
}

function mapOrderRow(row: OrderRow): OrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    grandTotal: row.grand_total,
    currency: row.currency,
    createdAt: row.created_at,
  };
}

function mapOrderDetailRow(row: OrderDetailRow): OrderDetail {
  return {
    ...mapOrderRow(row),
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    subtotal: row.subtotal,
    shippingTotal: row.shipping_total,
    items: (row.items ?? []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.product_name_snapshot,
      brand: item.brand_snapshot,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
    })),
  };
}

const ORDER_DETAIL_SELECT = `
  id, order_number, status, grand_total, currency, created_at,
  contact_name, contact_email, contact_phone, subtotal, shipping_total,
  items:order_items(id, product_id, product_name_snapshot, brand_snapshot, quantity, unit_price, line_total)
`;

// ---- Server-side helpers (only ever run inside the .handler() below) ----

/** Verifies the caller's bearer token independently of auth-middleware.ts (which throws on a missing token — order creation must support guests, so this returns null instead of failing). */
async function resolveUserIdFromRequest(): Promise<string | null> {
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length);
  if (!token || token.split(".").length !== 3) return null;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;

  const verifier = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await verifier.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub;
}

type AdminClient = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

async function resolveCustomerId(
  admin: AdminClient,
  userId: string | null,
  customer: OrderCustomerInput,
): Promise<string> {
  if (userId) {
    const { data: existing } = await admin
      .from("customers")
      .select("id")
      .eq("auth_user_id", userId)
      .maybeSingle();
    if (existing) return existing.id;

    const { data: created, error } = await admin
      .from("customers")
      .insert({
        auth_user_id: userId,
        full_name: customer.fullName,
        email: customer.email || null,
        phone: customer.phone,
      })
      .select("id")
      .single();
    if (error || !created) throw new Error(error?.message ?? "Failed to create customer record");
    return created.id;
  }

  // Guest checkout — reuse an existing guest customer row when we can match one, to avoid duplicates.
  const guestMatch = customer.email
    ? admin.from("customers").select("id").is("auth_user_id", null).eq("email", customer.email)
    : admin.from("customers").select("id").is("auth_user_id", null).eq("phone", customer.phone);
  const { data: existingGuest } = await guestMatch.maybeSingle();
  if (existingGuest) return existingGuest.id;

  const { data: created, error } = await admin
    .from("customers")
    .insert({
      auth_user_id: null,
      full_name: customer.fullName,
      email: customer.email || null,
      phone: customer.phone,
    })
    .select("id")
    .single();
  if (error || !created)
    throw new Error(error?.message ?? "Failed to create guest customer record");
  return created.id;
}

interface ResolvedOrderItem {
  productId: string | null;
  sku: string;
  name: string;
  brand: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** Re-derives the authoritative unit price from `products` when the item's id is a real DB row, preventing a tampered client price from reaching the order. Falls back to the client-submitted (already-validated positive) price when the product can't be looked up — e.g. the catalog is currently serving its static fallback data, whose ids aren't real UUIDs. */
async function resolveOrderItem(
  admin: AdminClient,
  item: OrderItemInput,
): Promise<ResolvedOrderItem> {
  let unitPrice = item.unitPrice;
  let productId: string | null = null;

  if (UUID_RE.test(item.productId)) {
    const { data: dbProduct, error } = await admin
      .from("products")
      .select("id, sale_price, original_price")
      .eq("id", item.productId)
      .maybeSingle();
    if (!error && dbProduct) {
      productId = dbProduct.id;
      unitPrice = dbProduct.sale_price ?? dbProduct.original_price;
    }
  }

  const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

  return {
    productId,
    // No dedicated SKU field exists on the client-side Product interface (out of scope to add one) — the product id doubles as the snapshot SKU.
    sku: item.productId,
    name: item.name,
    brand: item.brand ?? null,
    quantity: item.quantity,
    unitPrice,
    lineTotal,
  };
}

// ---- Server functions ----

const createOrderServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => input as CreateOrderInput)
  .handler(async ({ data }): Promise<CreateOrderResult> => {
    const validationError = validateCreateOrderInput(data);
    if (validationError) return { success: false, error: validationError };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      if (data.idempotencyKey) {
        const { data: existing } = await supabaseAdmin
          .from("orders")
          .select("id, order_number, status, grand_total, currency, created_at")
          .contains("meta", { idempotencyKey: data.idempotencyKey })
          .maybeSingle();
        if (existing) return { success: true, order: mapOrderRow(existing) };
      }

      const userId = await resolveUserIdFromRequest().catch(() => null);
      const customerId = await resolveCustomerId(supabaseAdmin, userId, data.customer);
      const resolvedItems = await Promise.all(
        data.items.map((item) => resolveOrderItem(supabaseAdmin, item)),
      );

      const subtotal = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const shippingTotal = subtotal > SHIPPING_FREE_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
      const grandTotal = subtotal + shippingTotal;

      if (grandTotal <= 0) {
        return {
          success: false,
          error: { code: "INVALID_TOTAL", message: "Order total must be greater than zero." },
        };
      }

      const shippingAddress = {
        address: data.shipping.address,
        city: data.shipping.city,
        postalCode: data.shipping.postalCode ?? null,
        notes: data.shipping.notes ?? null,
      };

      const { data: orderRow, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          customer_id: customerId,
          contact_name: data.customer.fullName,
          contact_email: data.customer.email || null,
          contact_phone: data.customer.phone,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          is_cod: true,
          payment_method: "cod",
          payment_status: "cod_pending",
          status: "pending",
          order_source: "website",
          subtotal,
          shipping_total: shippingTotal,
          discount_total: 0,
          tax_total: 0,
          grand_total: grandTotal,
          meta: data.idempotencyKey ? { idempotencyKey: data.idempotencyKey } : {},
        })
        .select("id, order_number, status, grand_total, currency, created_at")
        .single();

      if (orderError || !orderRow) {
        console.error("[orders] failed to insert order:", orderError?.message);
        return {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "We couldn't save your order. Please try again.",
          },
        };
      }

      const itemRows = resolvedItems.map((item) => ({
        order_id: orderRow.id,
        product_id: item.productId,
        sku_snapshot: item.sku,
        product_name_snapshot: item.name,
        brand_snapshot: item.brand,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
      }));

      const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemRows);

      if (itemsError) {
        console.error(
          "[orders] failed to insert order items, rolling back order:",
          itemsError.message,
        );
        await supabaseAdmin.from("orders").delete().eq("id", orderRow.id);
        return {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "We couldn't save your order items. Please try again.",
          },
        };
      }

      return { success: true, order: mapOrderRow(orderRow) };
    } catch (err) {
      console.error("[orders] createOrder unexpected error:", err);
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message:
            "Something went wrong placing your order. Please check your connection and try again.",
        },
      };
    }
  });

const getGuestOrderServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => input as { orderId: string; contact: string })
  .handler(async ({ data }): Promise<GetOrderResult> => {
    if (!isNonEmptyString(data.orderId) || !isNonEmptyString(data.contact)) {
      return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      const { data: row, error } = await supabaseAdmin
        .from("orders")
        .select(`${ORDER_DETAIL_SELECT}, customer:customers(auth_user_id)`)
        .eq("id", data.orderId)
        .maybeSingle();

      if (error) {
        console.error("[orders] getGuestOrder query failed:", error.message);
        return {
          success: false,
          error: { code: "DATABASE_ERROR", message: "We couldn't look up that order." },
        };
      }
      if (!row)
        return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };

      const typedRow = row as unknown as OrderDetailRow & {
        customer: { auth_user_id: string | null } | null;
      };

      // Orders belonging to a registered account aren't retrievable via the guest lookup path.
      if (typedRow.customer?.auth_user_id) {
        return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };
      }

      const contact = data.contact.trim().toLowerCase();
      const contactWithoutSpaces = data.contact.trim().replace(/\s+/g, "");
      const matches =
        (typedRow.contact_email && typedRow.contact_email.toLowerCase() === contact) ||
        (typedRow.contact_phone &&
          typedRow.contact_phone.replace(/\s+/g, "") === contactWithoutSpaces);

      if (!matches) {
        return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };
      }

      return { success: true, order: mapOrderDetailRow(typedRow) };
    } catch (err) {
      console.error("[orders] getGuestOrder unexpected error:", err);
      return {
        success: false,
        error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
      };
    }
  });

// ---- Public API ----

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    return await createOrderServerFn({ data: input });
  } catch (err) {
    console.error("[orders] createOrder transport error:", err);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message:
          "Something went wrong placing your order. Please check your connection and try again.",
      },
    };
  }
}

/** Authenticated lookup of a single order. RLS ("Customers view own orders/order items") already scopes this to the caller's own data — no server function needed. */
export async function getOrder(orderId: string): Promise<GetOrderResult> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Sign in to view this order." },
      };
    }

    const { data: row, error } = await supabase
      .from("orders")
      .select(ORDER_DETAIL_SELECT)
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("[orders] getOrder query failed:", error.message);
      return {
        success: false,
        error: { code: "DATABASE_ERROR", message: "We couldn't load that order." },
      };
    }
    if (!row) return { success: false, error: { code: "NOT_FOUND", message: "Order not found." } };

    return { success: true, order: mapOrderDetailRow(row as unknown as OrderDetailRow) };
  } catch (err) {
    console.error("[orders] getOrder unexpected error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

/** Authenticated list of the caller's own orders, newest first. RLS scopes this automatically. */
export async function getOrdersByUser(): Promise<GetOrdersByUserResult> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Sign in to view your orders." },
      };
    }

    const { data: rows, error } = await supabase
      .from("orders")
      .select("id, order_number, status, grand_total, currency, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[orders] getOrdersByUser query failed:", error.message);
      return {
        success: false,
        error: { code: "DATABASE_ERROR", message: "We couldn't load your orders." },
      };
    }

    return { success: true, orders: (rows ?? []).map(mapOrderRow) };
  } catch (err) {
    console.error("[orders] getOrdersByUser unexpected error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

/** Guest lookup — no session, no RLS path. Requires the order id plus the email or phone used at checkout as a lightweight ownership check. */
export async function getGuestOrder(orderId: string, contact: string): Promise<GetOrderResult> {
  try {
    return await getGuestOrderServerFn({ data: { orderId, contact } });
  } catch (err) {
    console.error("[orders] getGuestOrder transport error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
