import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { Loading } from "@/common/loading";
import { buildMeta, canonical } from "@/lib/seo";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      ...buildMeta({
        title: "Account",
        description: "Your Elite Brands account.",
        path: "/account",
      }),
      { name: "robots", content: "noindex" },
    ],
    links: canonical("/account"),
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, signOut } = useAuth();

  return (
    <AppShell>
      <PageHeader eyebrow="Your space" title="My Account" />
      <Container className="max-w-2xl py-14">
        {loading && <Loading label="Loading your account" />}

        {!loading && !user && (
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-elite-sm">
            <p className="text-sm text-muted-foreground">
              Sign in to view your orders, saved addresses and wishlist.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/auth/$mode"
                params={{ mode: "login" }}
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Link>
              <Link
                to="/auth/$mode"
                params={{ mode: "register" }}
                className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-accent"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {!loading && user && (
          <div className="rounded-lg border border-border bg-card p-8 shadow-elite-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 text-lg text-foreground">{user.email}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              Order history will appear here soon.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-accent"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </Container>
    </AppShell>
  );
}
