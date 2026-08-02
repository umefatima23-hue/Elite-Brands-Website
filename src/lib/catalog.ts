/**
 * Supabase-backed catalog implementation.
 *
 * Mirrors the static catalog in `@/data/products` field-for-field so any
 * consumer of the `Product`/`Brand` shape works unmodified regardless of
 * which source produced the data.
 *
 * Every export here is async (Supabase is a network call) and falls back to
 * the static catalog whenever Supabase has no products yet, or a query
 * fails (network issue, misconfigured project, RLS denial, etc). Nothing
 * ever throws to the caller — worst case, you get the existing static data.
 *
 * NOTE: existing routes/components still import the synchronous helpers
 * from `@/data/products` directly, and are untouched by this file. Wiring a
 * route or component to call these async functions instead is a separate,
 * deliberate follow-up (see the audit notes delivered alongside this file).
 */
import {
  BRANDS as STATIC_BRANDS,
  CATEGORIES as STATIC_CATEGORIES,
  PRODUCTS as STATIC_PRODUCTS,
  getProductBySlug as getStaticProductBySlug,
  getRelated as getStaticRelated,
  type Brand,
  type Product,
} from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

/** The `Product["category"]` union is closed — guard every DB value against it. */
const CATEGORY_LABELS: Record<Product["category"], string> = {
  unstitched: "Unstitched",
  "luxury-lawn": "Luxury Lawn",
  printed: "Printed Lawn",
  embroidered: "Embroidered",
};

function isKnownCategorySlug(slug: string | null | undefined): slug is Product["category"] {
  return !!slug && slug in CATEGORY_LABELS;
}

/** Deterministic 0–359 hue from a stable seed, so the same product/brand always renders the same placeholder color. */
function hueFromSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOrDefault(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function stringArrayOrDefault(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string") && value.length > 0) {
    return value;
  }
  return fallback;
}

// ---- Row shapes as selected from Supabase (subset of the generated types, joined) ----

interface BrandRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
}

interface ProductImageRow {
  url: string | null;
  is_primary: boolean;
  display_order: number;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  original_price: number;
  sale_price: number | null;
  status: string;
  attributes: unknown;
  short_description: string | null;
  long_description: string | null;
  is_new_arrival: boolean;
  is_premium_outlet: boolean;
  brand: BrandRow | null;
  category: CategoryRow | null;
  images: ProductImageRow[] | null;
}

const PRODUCT_SELECT = `
  id, slug, name, original_price, sale_price, status, attributes,
  short_description, long_description, is_new_arrival, is_premium_outlet,
  brand:brands(id, slug, name, tagline),
  category:categories!products_primary_category_id_fkey(id, slug, name),
  images:product_images(url, is_primary, display_order)
`;

/** Maps one joined Supabase product row into the existing `Product` shape. Returns null if the row can't be mapped safely (e.g. unknown category). */
function mapRowToProduct(row: ProductRow): Product | null {
  if (!row.brand || !isKnownCategorySlug(row.category?.slug)) return null;

  const hue = hueFromSeed(row.brand.slug);
  const sortedImages = [...(row.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.display_order - b.display_order;
  });
  const realImageUrls = sortedImages.map((img) => img.url).filter((url): url is string => !!url);
  const images =
    realImageUrls.length > 0 ? realImageUrls : [`ph-${hue}-0`, `ph-${hue}-1`, `ph-${hue}-2`];

  const attrs = isRecord(row.attributes) ? row.attributes : {};
  const originalPrice = row.original_price;
  const salePrice = row.sale_price ?? row.original_price;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand.name,
    brandSlug: row.brand.slug,
    category: row.category!.slug,
    categoryLabel: stringOrDefault(row.category!.name, CATEGORY_LABELS[row.category!.slug]),
    originalPrice,
    salePrice,
    images,
    fabric: stringOrDefault(attrs.fabric, "100% Pure Printed Lawn"),
    included: stringArrayOrDefault(attrs.included, [
      "Shirt Front & Back (2.5m)",
      "Printed Dupatta (2.5m)",
      "Dyed Trouser (2.5m)",
    ]),
    inStock: row.status === "active",
    isNew: row.is_new_arrival,
    isOutlet: row.is_premium_outlet,
    description: stringOrDefault(
      row.long_description ?? row.short_description,
      "A refined three-piece unstitched printed lawn ensemble crafted from the season's most coveted collection.",
    ),
    colorHue: hue,
  };
}

function mapRowToBrand(row: { slug: string; name: string; tagline: string | null }): Brand {
  return {
    slug: row.slug,
    name: row.name,
    tagline: stringOrDefault(row.tagline, ""),
    hue: hueFromSeed(row.slug),
  };
}

// ---- Public catalog API ----

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .is("deleted_at", null);

  if (error) {
    console.error("[catalog] listProducts failed, falling back to static catalog:", error.message);
    return STATIC_PRODUCTS;
  }

  const mapped = (data as unknown as ProductRow[])
    .map(mapRowToProduct)
    .filter((p): p is Product => p !== null);
  return mapped.length > 0 ? mapped : STATIC_PRODUCTS;
}

export async function listBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("slug, name, tagline")
    .eq("status", "active")
    .is("deleted_at", null);

  if (error) {
    console.error("[catalog] listBrands failed, falling back to static catalog:", error.message);
    return STATIC_BRANDS;
  }

  const mapped = data.map(mapRowToBrand);
  return mapped.length > 0 ? mapped : STATIC_BRANDS;
}

export async function listCategories(): Promise<
  typeof STATIC_CATEGORIES | { slug: Product["category"]; label: string }[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name")
    .eq("status", "active")
    .is("deleted_at", null);

  if (error) {
    console.error(
      "[catalog] listCategories failed, falling back to static catalog:",
      error.message,
    );
    return STATIC_CATEGORIES;
  }

  const mapped = data
    .filter((row) => isKnownCategorySlug(row.slug))
    .map((row) => ({
      slug: row.slug as Product["category"],
      label: stringOrDefault(row.name, CATEGORY_LABELS[row.slug as Product["category"]]),
    }));

  return mapped.length > 0 ? mapped : STATIC_CATEGORIES;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(
      `[catalog] getProductBySlug(${slug}) failed, falling back to static catalog:`,
      error.message,
    );
    return getStaticProductBySlug(slug);
  }
  if (!data) return getStaticProductBySlug(slug);

  return mapRowToProduct(data as unknown as ProductRow) ?? getStaticProductBySlug(slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      `[catalog] getProductById(${id}) failed, falling back to static catalog:`,
      error.message,
    );
    return STATIC_PRODUCTS.find((p) => p.id === id);
  }
  if (!data) return STATIC_PRODUCTS.find((p) => p.id === id);

  return mapRowToProduct(data as unknown as ProductRow) ?? STATIC_PRODUCTS.find((p) => p.id === id);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).in("id", ids);

  if (error) {
    console.error(
      "[catalog] getProductsByIds failed, falling back to static catalog:",
      error.message,
    );
    return STATIC_PRODUCTS.filter((p) => ids.includes(p.id));
  }

  const mapped = (data as unknown as ProductRow[])
    .map(mapRowToProduct)
    .filter((p): p is Product => p !== null);
  return mapped.length > 0 ? mapped : STATIC_PRODUCTS.filter((p) => ids.includes(p.id));
}

export async function getRelated(product: Product, n = 4): Promise<Product[]> {
  const { data: sameBrand, error: sameBrandError } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .is("deleted_at", null)
    .neq("id", product.id)
    .eq("brand.slug", product.brandSlug)
    .limit(n);

  if (sameBrandError) {
    console.error(
      "[catalog] getRelated failed, falling back to static catalog:",
      sameBrandError.message,
    );
    return getStaticRelated(product, n);
  }

  const brandMatches = (sameBrand as unknown as ProductRow[])
    .map(mapRowToProduct)
    .filter((p): p is Product => p !== null);

  if (brandMatches.length >= n) return brandMatches.slice(0, n);

  const excludeIds = [product.id, ...brandMatches.map((p) => p.id)];
  const { data: others, error: othersError } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .is("deleted_at", null)
    .not("id", "in", `(${excludeIds.join(",")})`)
    .limit(n - brandMatches.length);

  if (othersError) {
    console.error(
      "[catalog] getRelated fill query failed, returning brand matches only:",
      othersError.message,
    );
    return brandMatches;
  }

  const otherMatches = (others as unknown as ProductRow[])
    .map(mapRowToProduct)
    .filter((p): p is Product => p !== null);
  const combined = [...brandMatches, ...otherMatches];

  return combined.length > 0 ? combined : getStaticRelated(product, n);
}
