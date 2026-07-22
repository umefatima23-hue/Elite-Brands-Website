import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      ...buildMeta({ title: "Account", description: "Your Elite Brands account.", path: "/account" }),
      { name: "robots", content: "noindex" },
    ],
    links: canonical("/account"),
  }),
  component: () => (
    <AppShell>
      <PageHeader eyebrow="Your space" title="My Account" />
      <Container className="max-w-2xl py-14">
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-elite-sm">
          <p className="text-sm text-muted-foreground">
            Account dashboard will show orders, saved addresses and wishlist once authentication is connected.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/auth/$mode" params={{ mode: "login" }} className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90">
              Sign In
            </Link>
            <Link to="/auth/$mode" params={{ mode: "register" }} className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-accent">
              Create Account
            </Link>
          </div>
        </div>
      </Container>
    </AppShell>
  ),
});
