import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/admin-settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: SiteSettings };

function AdminSettingsPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getSiteSettings().then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", data: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-foreground">Settings</h2>
      </div>

      {state.status === "loading" && (
        <div className="space-y-3 rounded-lg border border-border bg-card p-6 shadow-elite-sm">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      {state.status === "ready" && (
        <SettingsForm
          settings={state.data}
          onSaved={(updated) => setState({ status: "ready", data: updated })}
        />
      )}
    </div>
  );
}

function SettingsForm({
  settings,
  onSaved,
}: {
  settings: SiteSettings;
  onSaved: (updated: SiteSettings) => void;
}) {
  const [form, setForm] = useState<SiteSettingsInput>(toInput(settings));
  const [keywordsInput, setKeywordsInput] = useState(settings.seoKeywords.join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof SiteSettingsInput>(key: K, value: SiteSettingsInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const seoKeywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const result = await updateSiteSettings({ ...form, seoKeywords });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    toast.success("Settings saved.");
    onSaved(result.data);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-elite-sm">
        <div>
          <h3 className="text-base font-medium text-foreground">Contact Information</h3>
          <p className="text-sm text-muted-foreground">
            Shown to customers across the storefront (footer, contact page).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact email">
            <Input
              type="email"
              value={form.contactEmail ?? ""}
              onChange={(e) => update("contactEmail", e.target.value || null)}
              placeholder="hello@elitebrands.pk"
            />
          </Field>
          <Field label="Contact phone">
            <Input
              value={form.contactPhone ?? ""}
              onChange={(e) => update("contactPhone", e.target.value || null)}
              placeholder="+92 300 1234567"
            />
          </Field>
          <Field label="WhatsApp number">
            <Input
              value={form.contactWhatsapp ?? ""}
              onChange={(e) => update("contactWhatsapp", e.target.value || null)}
              placeholder="+92 300 1234567"
            />
          </Field>
          <Field label="Business hours">
            <Input
              value={form.businessHours ?? ""}
              onChange={(e) => update("businessHours", e.target.value || null)}
              placeholder="Mon–Sat, 11am–8pm"
            />
          </Field>
          <Field label="City">
            <Input
              value={form.contactCity ?? ""}
              onChange={(e) => update("contactCity", e.target.value || null)}
              placeholder="Karachi"
            />
          </Field>
          <Field label="Country">
            <Input
              value={form.contactCountry ?? ""}
              onChange={(e) => update("contactCountry", e.target.value || null)}
              placeholder="Pakistan"
            />
          </Field>
        </div>
        <Field label="Address">
          <Textarea
            value={form.contactAddress ?? ""}
            onChange={(e) => update("contactAddress", e.target.value || null)}
            rows={2}
            placeholder="Shop #, street, area"
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-elite-sm">
        <div>
          <h3 className="text-base font-medium text-foreground">Default SEO</h3>
          <p className="text-sm text-muted-foreground">
            Fallback metadata used when a page doesn&apos;t set its own.
          </p>
        </div>
        <Field label="Default meta title" hint={`${form.defaultMetaTitle?.length ?? 0}/70`}>
          <Input
            value={form.defaultMetaTitle ?? ""}
            onChange={(e) => update("defaultMetaTitle", e.target.value || null)}
            maxLength={70}
          />
        </Field>
        <Field
          label="Default meta description"
          hint={`${form.defaultMetaDescription?.length ?? 0}/160`}
        >
          <Textarea
            value={form.defaultMetaDescription ?? ""}
            onChange={(e) => update("defaultMetaDescription", e.target.value || null)}
            rows={2}
            maxLength={160}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default OG image URL">
            <Input
              value={form.defaultOgImageUrl ?? ""}
              onChange={(e) => update("defaultOgImageUrl", e.target.value || null)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Twitter handle">
            <Input
              value={form.defaultTwitterHandle ?? ""}
              onChange={(e) => update("defaultTwitterHandle", e.target.value || null)}
              placeholder="@elitebrands"
            />
          </Field>
        </div>
        <Field label="SEO keywords" hint="Comma-separated">
          <Input
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            placeholder="fashion, karachi, boutique"
          />
        </Field>
        <Field label="Robots directives">
          <Input
            value={form.robotsDirectives ?? ""}
            onChange={(e) => update("robotsDirectives", e.target.value || null)}
            placeholder="index, follow"
          />
        </Field>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Last updated {new Date(settings.updatedAt).toLocaleString()}
        </p>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function toInput(settings: SiteSettings): SiteSettingsInput {
  return {
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactWhatsapp: settings.contactWhatsapp,
    contactAddress: settings.contactAddress,
    contactCity: settings.contactCity,
    contactCountry: settings.contactCountry,
    businessHours: settings.businessHours,
    defaultMetaTitle: settings.defaultMetaTitle,
    defaultMetaDescription: settings.defaultMetaDescription,
    defaultOgImageUrl: settings.defaultOgImageUrl,
    defaultTwitterHandle: settings.defaultTwitterHandle,
    seoKeywords: settings.seoKeywords,
    robotsDirectives: settings.robotsDirectives,
  };
}
