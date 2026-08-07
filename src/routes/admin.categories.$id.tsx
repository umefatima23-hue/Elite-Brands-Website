import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminCategoryForm } from "@/admin/brand-category-form";
import { Loading } from "@/common/loading";
import { getCategory, type AdminCategoryDetail } from "@/lib/admin-brands";

export const Route = createFileRoute("/admin/categories/$id")({
  component: EditCategoryPage,
});

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; category: AdminCategoryDetail };

function EditCategoryPage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getCategory(id).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", category: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") return <Loading label="Loading category" />;
  if (state.status === "error") {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        {state.message}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Edit Category</h2>
      <AdminCategoryForm
        mode="edit"
        categoryId={id}
        initial={state.category}
        cancelHref="/admin/categories"
        onSaved={() => {
          getCategory(id).then(
            (result) => result.success && setState({ status: "ready", category: result.data }),
          );
        }}
      />
    </div>
  );
}
