import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/orders")({
  component: () => (
    <PlaceholderSection
      title="Orders"
      note="Full order management is coming in a future milestone. Recent orders are visible on the Dashboard."
    />
  ),
});
