import { ChevronUp } from "lucide-react";
import { useScrollPosition } from "@/hooks/use-scroll-position";

export function BackToTop() {
  const y = useScrollPosition();
  if (y < 600) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-elite hover:bg-accent"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
