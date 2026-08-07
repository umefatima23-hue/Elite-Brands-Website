import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Button } from "@/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import {
  createBrand,
  updateBrand,
  createCategory,
  updateCategory,
  listCategoryOptions,
  slugify,
  ENTITY_STATUSES,
  type BrandFormInput,
  type CategoryFormInput,
  type AdminBrandDetail,
  type AdminCategoryDetail,
  type CategoryOption,
  type EntityStatus,
} from "@/lib/admin-brands";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  coming_soon: "Coming Soon",
  out_of_stock: "Out of Stock",
  archived: "Archived",
  discontinued: "Discontinued",
};

function emptyBrandForm(): BrandFormInput {
  return {
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    status: "draft",
    isFeatured: false,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
  };
}

function brandDetailToForm(b: AdminBrandDetail): BrandFormInput {
  return {
    name: b.name,
    slug: b.slug,
    description: b.description,
    logoUrl: b.logoUrl,
    status: b.status,
    isFeatured: b.isFeatured,
    sortOrder: b.sortOrder,
    seoTitle: b.seoTitle,
    seoDescription: b.seoDescription,
  };
}

export function AdminBrandForm({
  mode,
  brandId,
  initial,
  onSaved,
  cancelHref,
}: {
  mode: "create" | "edit";
  brandId?: string;
  initial?: AdminBrandDetail;
  onSaved: (id: string) => void;
  cancelHref: string;
}) {
  const [form, setForm] = useState<BrandFormInput>(
    initial ? brandDetailToForm(initial) : emptyBrandForm(),
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof BrandFormInput>(key: K, value: BrandFormInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result = mode === "create" ? await createBrand(form) : await updateBrand(brandId!, form);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    toast.success(mode === "create" ? "Brand created." : "Brand saved.");
    onSaved(result.data.id);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <section className="grid gap-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              update("name", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
            required
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Lowercase letters, numbers, hyphens only.
          </p>
        </div>
        <div>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={form.logoUrl}
            onChange={(e) => update("logoUrl", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v as EntityStatus)}>
            <SelectTrigger id="status" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            step="1"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-4 py-3 sm:col-span-2">
          <p className="text-sm font-medium text-foreground">Featured</p>
          <Switch checked={form.isFeatured} onCheckedChange={(v) => update("isFeatured", v)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="mt-1.5"
          />
        </div>
      </section>
      <section className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">SEO</p>
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={form.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            rows={3}
            className="mt-1.5"
          />
        </div>
      </section>
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create Brand" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function emptyCategoryForm(): CategoryFormInput {
  return {
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    status: "draft",
    isFeatured: false,
    sortOrder: 0,
    parentId: null,
    seoTitle: "",
    seoDescription: "",
  };
}

function categoryDetailToForm(c: AdminCategoryDetail): CategoryFormInput {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    status: c.status,
    isFeatured: c.isFeatured,
    sortOrder: c.sortOrder,
    parentId: c.parentId,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
  };
}

export function AdminCategoryForm({
  mode,
  categoryId,
  initial,
  onSaved,
  cancelHref,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  initial?: AdminCategoryDetail;
  onSaved: (id: string) => void;
  cancelHref: string;
}) {
  const [form, setForm] = useState<CategoryFormInput>(
    initial ? categoryDetailToForm(initial) : emptyCategoryForm(),
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [parentOptions, setParentOptions] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCategoryOptions(categoryId).then((r) => r.success && setParentOptions(r.data));
  }, [categoryId]);

  const update = <K extends keyof CategoryFormInput>(key: K, value: CategoryFormInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result =
      mode === "create" ? await createCategory(form) : await updateCategory(categoryId!, form);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    toast.success(mode === "create" ? "Category created." : "Category saved.");
    onSaved(result.data.id);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <section className="grid gap-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              update("name", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
            required
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Lowercase letters, numbers, hyphens only.
          </p>
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="parent">Parent Category</Label>
          <Select
            value={form.parentId ?? "none"}
            onValueChange={(v) => update("parentId", v === "none" ? null : v)}
          >
            <SelectTrigger id="parent" className="mt-1.5">
              <SelectValue placeholder="None (top-level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (top-level)</SelectItem>
              {parentOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v as EntityStatus)}>
            <SelectTrigger id="status" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            step="1"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-4 py-3 sm:col-span-2">
          <p className="text-sm font-medium text-foreground">Featured</p>
          <Switch checked={form.isFeatured} onCheckedChange={(v) => update("isFeatured", v)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="mt-1.5"
          />
        </div>
      </section>
      <section className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">SEO</p>
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={form.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            rows={3}
            className="mt-1.5"
          />
        </div>
      </section>
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create Category" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
