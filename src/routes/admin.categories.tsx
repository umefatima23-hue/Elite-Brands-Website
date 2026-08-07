import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import {
  listCategoriesAdmin,
  deleteCategory,
  restoreCategory,
  ENTITY_STATUSES,
  type AdminCategoryListItem,
  type EntityStatus,
} from "@/lib/admin-brands";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

const PAGE_SIZE = 20;
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  coming_soon: "Coming Soon",
  out_of_stock: "Out of Stock",
  archived: "Archived",
  discontinued: "Discontinued",
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: AdminCategoryListItem[]; total: number };

function AdminCategoriesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus | "all">("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    listCategoriesAdmin({
      search,
      status,
      includeDeleted: showDeleted,
      page,
      pageSize: PAGE_SIZE,
    }).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", items: result.data.items, total: result.data.total }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [search, status, showDeleted, page, refreshToken]);

  const refresh = () => setRefreshToken((n) => n + 1);

  const onDelete = async (category: AdminCategoryListItem) => {
    const result = await deleteCategory(category.id);
    if (!result.success) return toast.error(result.error.message);
    toast.success(`"${category.name}" deleted.`);
    refresh();
  };

  const onRestore = async (category: AdminCategoryListItem) => {
    const result = await restoreCategory(category.id);
    if (!result.success) return toast.error(result.error.message);
    toast.success(`"${category.name}" restored.`);
    refresh();
  };

  const total = state.status === "ready" ? state.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-foreground">Categories</h2>
        <Button asChild>
          <Link to="/admin/categories/new">New Category</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as EntityStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ENTITY_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => {
              setShowDeleted(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-input"
          />
          Show deleted
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-elite-sm">
        {state.status === "loading" && (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="p-6 text-sm text-muted-foreground">{state.message}</p>
        )}

        {state.status === "ready" && state.items.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No categories match these filters.</p>
        )}

        {state.status === "ready" && state.items.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Parent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category.parentName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={category.status === "active" ? "default" : "secondary"}>
                        {STATUS_LABELS[category.status]}
                      </Badge>
                      {category.deletedAt && <Badge variant="destructive">Deleted</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {category.isFeatured ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category.sortOrder}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {category.deletedAt ? (
                        <Button variant="outline" size="sm" onClick={() => onRestore(category)}>
                          Restore
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <Link to="/admin/categories/$id" params={{ id: category.id }}>
                              Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete "{category.name}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This removes it from the storefront. You can restore it later from
                                  "Show deleted". Products or subcategories referencing it are not
                                  reassigned automatically.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(category)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {state.status === "ready" && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {page} of {totalPages} · {total} categor{total === 1 ? "y" : "ies"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
