import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminCategoryForm } from "@/admin/brand-category-form";

export const Route = createFileRoute("/admin/categories/new")({
  component: NewCategoryPage,
});

function NewCategoryPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">New Category</h2>
      <AdminCategoryForm
        mode="create"
        cancelHref="/admin/categories"
        onSaved={(id) => navigate({ to: "/admin/categories/$id", params: { id } })}
      />
    </div>
  );
}
