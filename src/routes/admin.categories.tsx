import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/categories")({
  component: () => (
    <PlaceholderSection
      title="Categories"
      note="Category management is coming in a future milestone."
    />
  ),
});
