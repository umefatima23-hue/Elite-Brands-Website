import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminBrandForm } from "@/admin/brand-category-form";

export const Route = createFileRoute("/admin/brands/new")({
  component: NewBrandPage,
});

function NewBrandPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">New Brand</h2>
      <AdminBrandForm
        mode="create"
        cancelHref="/admin/brands"
        onSaved={(id) => navigate({ to: "/admin/brands/$id", params: { id } })}
      />
    </div>
  );
}
