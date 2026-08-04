import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/products")({
  component: () => (
    <PlaceholderSection
      title="Products"
      note="Product management is coming in a future milestone."
    />
  ),
});
