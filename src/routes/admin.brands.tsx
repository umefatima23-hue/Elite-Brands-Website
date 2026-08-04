import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/brands")({
  component: () => (
    <PlaceholderSection title="Brands" note="Brand management is coming in a future milestone." />
  ),
});
