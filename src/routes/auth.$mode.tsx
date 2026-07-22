import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { buildMeta, canonical } from "@/lib/seo";

const MODES: Record<string, { title: string; cta: string; alt: { text: string; label: string; href: string } }> = {
  login: {
    title: "Sign In",
    cta: "Sign In",
    alt: { text: "New to Elite Brands?", label: "Create an account", href: "/auth/register" },
  },
  register: {
    title: "Create Account",
    cta: "Create Account",
    alt: { text: "Already have an account?", label: "Sign in", href: "/auth/login" },
  },
  reset: {
    title: "Reset Password",
    cta: "Send Reset Link",
    alt: { text: "Remembered your password?", label: "Back to sign in", href: "/auth/login" },
  },
};

export const Route = createFileRoute("/auth/$mode")({
  beforeLoad: ({ params }) => {
    if (!MODES[params.mode]) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      ...buildMeta({
        title: MODES[params.mode]?.title ?? "Account",
        description: "Sign in to Elite Brands.",
        path: `/auth/${params.mode}`,
      }),
      { name: "robots", content: "noindex" },
    ],
    links: canonical(`/auth/${params.mode}`),
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useParams();
  const meta = MODES[mode]!;
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(mode === "reset" ? "Reset link sent (demo)" : `${meta.title} successful (demo)`);
    navigate({ to: "/account" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Account" title={meta.title} />
      <Container className="max-w-md py-14">
        <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-border bg-card p-7 shadow-elite-sm">
          {mode === "register" && (
            <div>
              <Label htmlFor="name" className="mb-1.5 block text-xs">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="mb-1.5 block text-xs">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          {mode !== "reset" && (
            <div>
              <Label htmlFor="password" className="mb-1.5 block text-xs">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
          )}
          {mode === "login" && (
            <div className="text-right">
              <Link to="/auth/$mode" params={{ mode: "reset" }} className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
          >
            {meta.cta}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            {meta.alt.text}{" "}
            <Link to={meta.alt.href} className="font-semibold text-primary hover:underline">
              {meta.alt.label}
            </Link>
          </p>
          <p className="rounded-md border border-dashed border-border bg-surface p-3 text-center text-[11px] text-muted-foreground">
            Authentication is in demo mode. Backend will be wired to Lovable Cloud.
          </p>
        </form>
      </Container>
    </AppShell>
  );
}
