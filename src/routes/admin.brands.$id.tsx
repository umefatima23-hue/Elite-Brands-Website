import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminBrandForm } from "@/admin/brand-category-form";
import { Loading } from "@/common/loading";
import { getBrand, type AdminBrandDetail } from "@/lib/admin-brands";

export const Route = createFileRoute("/admin/brands/$id")({
  component: EditBrandPage,
});

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; brand: AdminBrandDetail };

function EditBrandPage() {
  const { id } = Route.useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getBrand(id).then((result) => {
      if (cancelled) return;
      setState(
        result.success
          ? { status: "ready", brand: result.data }
          : { status: "error", message: result.error.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") return <Loading label="Loading brand" />;
  if (state.status === "error") {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        {state.message}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Edit Brand</h2>
      <AdminBrandForm
        mode="edit"
        brandId={id}
        initial={state.brand}
        cancelHref="/admin/brands"
        onSaved={() => {
          getBrand(id).then(
            (result) => result.success && setState({ status: "ready", brand: result.data }),
          );
        }}
      />
    </div>
  );
}
