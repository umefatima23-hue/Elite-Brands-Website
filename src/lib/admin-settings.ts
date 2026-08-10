/**
 * Admin Settings.
 *
 * Backed by `public.site_settings` — a singleton table (`id boolean PRIMARY
 * KEY DEFAULT true CHECK (id = true)`), pre-seeded with exactly one row.
 * Verified directly against supabase/migrations/20260713110833_*.sql and
 * the generated types in src/integrations/supabase/types.ts before writing
 * any of this — every field below is a real column, nothing invented.
 *
 * Scope note: the schema also has `public.application_settings` (a generic
 * key/value store with `is_secret`/`is_public` flags) and
 * `public.feature_flags`. Both exist but have zero seeded rows anywhere in
 * the migrations and no established set of known keys used by any part of
 * this codebase — there's nothing concrete to build a safe editor against,
 * and `application_settings` explicitly anticipates storing secrets
 * (`is_secret`), which a generic client-side editor should not blindly
 * expose. Deliberately out of scope for this pass rather than invented.
 *
 * RLS (verified in the same migration): `site_settings_public_read` (SELECT,
 * anyone), `site_settings_staff_insert` / `site_settings_staff_update`
 * (INSERT/UPDATE, `is_staff()` — super_admin, admin, manager, or staff),
 * `site_settings_superadmin_delete` (DELETE, super_admin only — not used
 * here; a singleton settings row is never deleted). Reads and writes both
 * go through the normal RLS-scoped browser client — no service role.
 */
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactAddress: string | null;
  contactCity: string | null;
  contactCountry: string | null;
  businessHours: string | null;
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  defaultOgImageUrl: string | null;
  defaultTwitterHandle: string | null;
  seoKeywords: string[];
  robotsDirectives: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface SiteSettingsInput {
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactAddress: string | null;
  contactCity: string | null;
  contactCountry: string | null;
  businessHours: string | null;
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  defaultOgImageUrl: string | null;
  defaultTwitterHandle: string | null;
  seoKeywords: string[];
  robotsDirectives: string | null;
}

export type SettingsErrorCode =
  | "VALIDATION_ERROR"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

export interface SettingsError {
  code: SettingsErrorCode;
  message: string;
}

export type Result<T> = { success: true; data: T } | { success: false; error: SettingsError };

function mapError(
  error: { code?: string; message: string } | null,
  fallback: string,
): SettingsError {
  // Postgres/PostgREST insufficient_privilege — surfaced when RLS denies a non-staff caller.
  if (error?.code === "42501") {
    return {
      code: "PERMISSION_DENIED",
      message: "You don't have permission to change these settings.",
    };
  }
  return { code: "DATABASE_ERROR", message: fallback };
}

interface SiteSettingsRow {
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_address: string | null;
  contact_city: string | null;
  contact_country: string | null;
  business_hours: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_og_image_url: string | null;
  default_twitter_handle: string | null;
  seo_keywords: string[] | null;
  robots_directives: string | null;
  updated_at: string;
  updated_by: string | null;
}

const SELECT_COLUMNS =
  "contact_email, contact_phone, contact_whatsapp, contact_address, contact_city, contact_country, business_hours, default_meta_title, default_meta_description, default_og_image_url, default_twitter_handle, seo_keywords, robots_directives, updated_at, updated_by";

function mapRow(row: SiteSettingsRow): SiteSettings {
  return {
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactWhatsapp: row.contact_whatsapp,
    contactAddress: row.contact_address,
    contactCity: row.contact_city,
    contactCountry: row.contact_country,
    businessHours: row.business_hours,
    defaultMetaTitle: row.default_meta_title,
    defaultMetaDescription: row.default_meta_description,
    defaultOgImageUrl: row.default_og_image_url,
    defaultTwitterHandle: row.default_twitter_handle,
    seoKeywords: row.seo_keywords ?? [],
    robotsDirectives: row.robots_directives,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validate(input: SiteSettingsInput): string | null {
  if (input.contactEmail && !EMAIL_RE.test(input.contactEmail)) {
    return "Enter a valid contact email address.";
  }
  if (input.defaultMetaTitle && input.defaultMetaTitle.length > 70) {
    return "Default meta title should be 70 characters or fewer for SEO.";
  }
  if (input.defaultMetaDescription && input.defaultMetaDescription.length > 160) {
    return "Default meta description should be 160 characters or fewer for SEO.";
  }
  return null;
}

/** Reads the singleton settings row. Public read — but this admin page only calls it for staff. */
export async function getSiteSettings(): Promise<Result<SiteSettings>> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select(SELECT_COLUMNS)
      .eq("id", true)
      .maybeSingle();

    if (error) return { success: false, error: mapError(error, "We couldn't load settings.") };
    if (!data)
      return { success: false, error: { code: "NOT_FOUND", message: "Settings row not found." } };

    return { success: true, data: mapRow(data as unknown as SiteSettingsRow) };
  } catch (err) {
    console.error("[admin-settings] getSiteSettings error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}

/** Updates the singleton settings row. Staff-only via RLS (is_staff()). */
export async function updateSiteSettings(input: SiteSettingsInput): Promise<Result<SiteSettings>> {
  const validationMessage = validate(input);
  if (validationMessage) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: validationMessage } };
  }

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .update({
        contact_email: input.contactEmail,
        contact_phone: input.contactPhone,
        contact_whatsapp: input.contactWhatsapp,
        contact_address: input.contactAddress,
        contact_city: input.contactCity,
        contact_country: input.contactCountry,
        business_hours: input.businessHours,
        default_meta_title: input.defaultMetaTitle,
        default_meta_description: input.defaultMetaDescription,
        default_og_image_url: input.defaultOgImageUrl,
        default_twitter_handle: input.defaultTwitterHandle,
        seo_keywords: input.seoKeywords,
        robots_directives: input.robotsDirectives,
      })
      .eq("id", true)
      .select(SELECT_COLUMNS)
      .single();

    if (error) return { success: false, error: mapError(error, "We couldn't save settings.") };

    return { success: true, data: mapRow(data as unknown as SiteSettingsRow) };
  } catch (err) {
    console.error("[admin-settings] updateSiteSettings error:", err);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Something went wrong. Please try again." },
    };
  }
}
