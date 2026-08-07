/**
 * Admin Brands & Categories CRUD.
 *
 * Schema notes (verified against src/integrations/supabase/types.ts and the
 * migrations before writing any of this):
 *
 * - Neither `brands` nor `categories` has a `seo_title`/`seo_description`
 *   column (unlike `products`, which does). Both tables do have a `meta:
 *   Json` column already, so SEO title/description are stored there as
 *   `{ seoTitle, seoDescription }` rather than inventing new columns —
 *   no SQL/schema change, just using the existing flexible field for
 *   exactly the kind of metadata it's meant for.
 * - Neither table has a boolean "active" column — both reuse the shared
 *   `product_status` enum (draft/active/coming_soon/out_of_stock/archived/
 *   discontinued). "Active/Inactive" here is a toggle between 'active' and
 *   'archived', with the full enum available for completeness.
 * - `categories.parent_id` exists (self-referencing, nullable) — parent
 *   category selection is real, not simulated.
 * - RLS (`brands_insert_staff` / `brands_update_staff` /
 *   `categories_insert_staff` / `categories_update_staff`) already lets any
 *   staff role write directly via the browser client — no service role
 *   needed. Hard DELETE is restricted to super_admin
 *   (`brands_delete_super_admin` / `categories_delete_super_admin`), so
 *   "delete" here is a soft delete (`deleted_at`), which every staff role
 *   can perform via the existing UPDATE policy, and "restore" simply clears
 *   it back to null — also an UPDATE, also staff-permitted.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const ENTITY_STATUSES = [
  "draft",
  "active",
  "coming_soon",
  "out_of_stock",
  "archived",
  "discontinued",
] as const;
export type EntityStatus = (typeof ENTITY_STATUSES)[number];

export interface CategoryOption {
  id: string;
  name: string;
}

export interface AdminBrandListItem {
  id: string;
  name: string;
  slug: string;
  status: EntityStatus;
  isFeatured: boolean;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBrandDetail extends AdminBrandListItem {
  description: string;
  logoUrl: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BrandFormInput {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  status: EntityStatus;
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export interface AdminCategoryListItem {
  id: string;
  name: string;
  slug: string;
  status: EntityStatus;
  isFeatured: boolean;
  sortOrder: number;
  parentId: string | null;
  parentName: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategoryDetail extends AdminCategoryListItem {
  description: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryFormInput {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  status: EntityStatus;
  isFeatured: boolean;
  sortOrder: number;
  parentId: string | null;
  seoTitle: string;
  seoDescription: string;
}

export type AdminOpErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_SLUG"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

export interface AdminOpError {
  code: AdminOpErrorCode;
  message: string;
}

export type Result<T> = { success: true; data: T } | { success: false; error: AdminOpError };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapError(
  error: { code?: string; message: string } | null,
  fallback: string,
): AdminOpError {
  if (error?.code === "42501") {
    return { code: "PERMISSION_DENIED", message: "You don't have permission to do this." };
  }
  if (error?.code === "23505") {
    return { code: "DUPLICATE_SLUG", message: "That slug is already in use." };
  }
  return { code: "DATABASE_ERROR", message: fallback };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readMetaSeo(meta: unknown): { seoTitle: string; seoDescription: string } {
  if (!isRecord(meta)) return { seoTitle: "", seoDescription: "" };
  const seoTitle = typeof meta.seoTitle === "string" ? meta.seoTitle : "";
  const seoDescription = typeof meta.seoDescription === "string" ? meta.seoDescription : "";
  return { seoTitle, seoDescription };
}

function buildMeta(
  existing: unknown,
  seoTitle: string,
  seoDescription: string,
): Record<string, unknown> {
  const base = isRecord(existing) ? { ...existing } : {};
  if (seoTitle) base.seoTitle = seoTitle;
  else delete base.seoTitle;
  if (seoDescription) base.seoDescription = seoDescription;
  else delete base.seoDescription;
  return base;
}

function validateSlugAndName(name: string, slug: string): AdminOpError | null {
  if (!name.trim()) return { code: "VALIDATION_ERROR", message: "Name is required." };
  if (!SLUG_RE.test(slug)) {
    return {
      code: "VALIDATION_ERROR",
      message: "Slug must be lowercase letters, numbers, and single hyphens only.",
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  status: EntityStatus;
  is_featured: boolean;
  sort_order: number;
  meta: unknown;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const BRAND_SELECT =
  "id, name, slug, description, logo_url, status, is_featured, sort_order, meta, deleted_at, created_at, updated_at";

function mapBrandRow(row: BrandRow): AdminBrandDetail {
  const { seoTitle, seoDescription } = readMetaSeo(row.meta);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    description: row.description ?? "",
    logoUrl: row.logo_url ?? "",
    seoTitle,
    seoDescription,
  };
}

export interface ListBrandsParams {
  search?: string;
  status?: EntityStatus | "all";
  includeDeleted?: boolean;
  page: number;
  pageSize: number;
}

export async function listBrandsAdmin(
  params: ListBrandsParams,
): Promise<Result<{ items: AdminBrandListItem[]; total: number }>> {
  try {
    const from = (params.page - 1) * params.pageSize;
    let query = supabase.from("brands").select(BRAND_SELECT, { count: "exact" });

    if (!params.includeDeleted) query = query.is("deleted_at", null);
    if (params.search) {
      const term = params.search.replace(/[,()%]/g, " ").trim();
      if (term) query = query.ilike("name", `%${term}%`);
    }
    if (params.status && params.status !== "all") query = query.eq("status", params.status);

    const { data, error, count } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(from, from + params.pageSize - 1);

    if (error) return { success: false, error: mapError(error, "We couldn't load brands.") };

    return {
      success: true,
      data: { items: (data as unknown as BrandRow[]).map(mapBrandRow), total: count ?? 0 },
    };
  } catch (err) {
    console.error("[admin-brands] listBrandsAdmin error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function getBrand(id: string): Promise<Result<AdminBrandDetail>> {
  try {
    const { data, error } = await supabase
      .from("brands")
      .select(BRAND_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) return { success: false, error: mapError(error, "We couldn't load that brand.") };
    if (!data) return { success: false, error: { code: "NOT_FOUND", message: "Brand not found." } };
    return { success: true, data: mapBrandRow(data as unknown as BrandRow) };
  } catch (err) {
    console.error("[admin-brands] getBrand error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function createBrand(input: BrandFormInput): Promise<Result<{ id: string }>> {
  const validationError = validateSlugAndName(input.name, input.slug);
  if (validationError) return { success: false, error: validationError };

  try {
    const { data, error } = await supabase
      .from("brands")
      .insert({
        name: input.name.trim(),
        slug: input.slug,
        description: input.description || null,
        logo_url: input.logoUrl || null,
        status: input.status,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
        meta: buildMeta(
          {},
          input.seoTitle,
          input.seoDescription,
        ) as Database["public"]["Tables"]["brands"]["Insert"]["meta"],
      })
      .select("id")
      .single();

    if (error || !data)
      return { success: false, error: mapError(error, "We couldn't create that brand.") };
    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("[admin-brands] createBrand error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function updateBrand(
  id: string,
  input: BrandFormInput,
): Promise<Result<{ id: string }>> {
  const validationError = validateSlugAndName(input.name, input.slug);
  if (validationError) return { success: false, error: validationError };

  try {
    const { data: current } = await supabase
      .from("brands")
      .select("meta")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("brands")
      .update({
        name: input.name.trim(),
        slug: input.slug,
        description: input.description || null,
        logo_url: input.logoUrl || null,
        status: input.status,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
        meta: buildMeta(
          current?.meta,
          input.seoTitle,
          input.seoDescription,
        ) as Database["public"]["Tables"]["brands"]["Update"]["meta"],
      })
      .eq("id", id);

    if (error) return { success: false, error: mapError(error, "We couldn't save that brand.") };
    return { success: true, data: { id } };
  } catch (err) {
    console.error("[admin-brands] updateBrand error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function deleteBrand(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase
      .from("brands")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) return { success: false, error: mapError(error, "We couldn't delete that brand.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-brands] deleteBrand error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function restoreBrand(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase.from("brands").update({ deleted_at: null }).eq("id", id);
    if (error) return { success: false, error: mapError(error, "We couldn't restore that brand.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-brands] restoreBrand error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: EntityStatus;
  is_featured: boolean;
  sort_order: number;
  parent_id: string | null;
  parent: { name: string } | null;
  meta: unknown;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORY_SELECT =
  "id, name, slug, description, image_url, status, is_featured, sort_order, parent_id, parent:categories!categories_parent_id_fkey(name), meta, deleted_at, created_at, updated_at";

function mapCategoryRow(row: CategoryRow): AdminCategoryDetail {
  const { seoTitle, seoDescription } = readMetaSeo(row.meta);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    parentId: row.parent_id,
    parentName: row.parent?.name ?? null,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    seoTitle,
    seoDescription,
  };
}

export interface ListCategoriesParams {
  search?: string;
  status?: EntityStatus | "all";
  includeDeleted?: boolean;
  page: number;
  pageSize: number;
}

export async function listCategoriesAdmin(
  params: ListCategoriesParams,
): Promise<Result<{ items: AdminCategoryListItem[]; total: number }>> {
  try {
    const from = (params.page - 1) * params.pageSize;
    let query = supabase.from("categories").select(CATEGORY_SELECT, { count: "exact" });

    if (!params.includeDeleted) query = query.is("deleted_at", null);
    if (params.search) {
      const term = params.search.replace(/[,()%]/g, " ").trim();
      if (term) query = query.ilike("name", `%${term}%`);
    }
    if (params.status && params.status !== "all") query = query.eq("status", params.status);

    const { data, error, count } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(from, from + params.pageSize - 1);

    if (error) return { success: false, error: mapError(error, "We couldn't load categories.") };

    return {
      success: true,
      data: { items: (data as unknown as CategoryRow[]).map(mapCategoryRow), total: count ?? 0 },
    };
  } catch (err) {
    console.error("[admin-brands] listCategoriesAdmin error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

/** Flat list of non-deleted categories for the "Parent category" selector. */
export async function listCategoryOptions(excludeId?: string): Promise<Result<CategoryOption[]>> {
  try {
    let query = supabase.from("categories").select("id, name").is("deleted_at", null).order("name");
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query;
    if (error) return { success: false, error: mapError(error, "We couldn't load categories.") };
    return { success: true, data: data ?? [] };
  } catch (err) {
    console.error("[admin-brands] listCategoryOptions error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function getCategory(id: string): Promise<Result<AdminCategoryDetail>> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select(CATEGORY_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) return { success: false, error: mapError(error, "We couldn't load that category.") };
    if (!data)
      return { success: false, error: { code: "NOT_FOUND", message: "Category not found." } };
    return { success: true, data: mapCategoryRow(data as unknown as CategoryRow) };
  } catch (err) {
    console.error("[admin-brands] getCategory error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function createCategory(input: CategoryFormInput): Promise<Result<{ id: string }>> {
  const validationError = validateSlugAndName(input.name, input.slug);
  if (validationError) return { success: false, error: validationError };

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: input.name.trim(),
        slug: input.slug,
        description: input.description || null,
        image_url: input.imageUrl || null,
        status: input.status,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
        parent_id: input.parentId,
        meta: buildMeta(
          {},
          input.seoTitle,
          input.seoDescription,
        ) as Database["public"]["Tables"]["categories"]["Insert"]["meta"],
      })
      .select("id")
      .single();

    if (error || !data)
      return { success: false, error: mapError(error, "We couldn't create that category.") };
    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("[admin-brands] createCategory error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryFormInput,
): Promise<Result<{ id: string }>> {
  const validationError = validateSlugAndName(input.name, input.slug);
  if (validationError) return { success: false, error: validationError };
  if (input.parentId === id) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "A category can't be its own parent." },
    };
  }

  try {
    const { data: current } = await supabase
      .from("categories")
      .select("meta")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("categories")
      .update({
        name: input.name.trim(),
        slug: input.slug,
        description: input.description || null,
        image_url: input.imageUrl || null,
        status: input.status,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
        parent_id: input.parentId,
        meta: buildMeta(
          current?.meta,
          input.seoTitle,
          input.seoDescription,
        ) as Database["public"]["Tables"]["categories"]["Update"]["meta"],
      })
      .eq("id", id);

    if (error) return { success: false, error: mapError(error, "We couldn't save that category.") };
    return { success: true, data: { id } };
  } catch (err) {
    console.error("[admin-brands] updateCategory error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function deleteCategory(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase
      .from("categories")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error)
      return { success: false, error: mapError(error, "We couldn't delete that category.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-brands] deleteCategory error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

export async function restoreCategory(id: string): Promise<Result<void>> {
  try {
    const { error } = await supabase.from("categories").update({ deleted_at: null }).eq("id", id);
    if (error)
      return { success: false, error: mapError(error, "We couldn't restore that category.") };
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[admin-brands] restoreCategory error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
