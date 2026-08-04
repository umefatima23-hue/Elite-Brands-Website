import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderSection } from "@/common/placeholder-section";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <PlaceholderSection title="Settings" note="Store settings are coming in a future milestone." />
  ),
});
