import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/customers")({
  component: () => (
    <PlaceholderSection
      title="Customers"
      note="Customer management is coming in a future milestone."
    />
  ),
});
