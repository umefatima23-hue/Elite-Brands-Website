import { createFileRoute, Link } from "@tanstack/react-router";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      ...buildMeta({
        title: "We'll be right back",
        description: "Elite Brands is undergoing scheduled maintenance.",
        path: "/maintenance",
      }),
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Maintenance</p>
        <h1 className="mt-2 text-4xl text-foreground">We'll be right back</h1>
        <span className="gold-rule mx-auto my-5" />
        <p className="text-sm text-muted-foreground">
          Elite Brands is undergoing scheduled maintenance. Thank you for your patience.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-input px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-accent"
          >
            Try home
          </Link>
        </div>
      </div>
    </div>
  ),
});
