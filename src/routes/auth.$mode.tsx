import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { buildMeta, canonical } from "@/lib/seo";
import { useAuth } from "@/stores/auth";

const MODES: Record<
  string,
  { title: string; cta: string; alt: { text: string; label: string; href: string } | null }
> = {
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
  "update-password": {
    title: "Set New Password",
    cta: "Update Password",
    alt: null,
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
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");

    if (mode === "login") {
      const { error } = await signIn(email, password);
      setSubmitting(false);
      if (error) return toast.error(error);
      toast.success("Signed in.");
      navigate({ to: "/account" });
      return;
    }

    if (mode === "register") {
      const { error, needsEmailConfirmation } = await signUp(email, password, name || undefined);
      setSubmitting(false);
      if (error) return toast.error(error);
      if (needsEmailConfirmation) {
        toast.success("Account created. Check your email to confirm before signing in.");
        navigate({ to: "/auth/$mode", params: { mode: "login" } });
        return;
      }
      toast.success("Account created.");
      navigate({ to: "/account" });
      return;
    }

    if (mode === "reset") {
      const { error } = await resetPassword(email);
      setSubmitting(false);
      // Avoid revealing whether an email is registered — always show success.
      if (error) toast.error(error);
      else toast.success("If that email has an account, a reset link is on its way.");
      return;
    }

    if (mode === "update-password") {
      const { error } = await updatePassword(password);
      setSubmitting(false);
      if (error) return toast.error(error);
      toast.success("Password updated.");
      navigate({ to: "/account" });
    }
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Account" title={meta.title} />
      <Container className="max-w-md py-14">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-lg border border-border bg-card p-7 shadow-elite-sm"
        >
          {mode === "register" && (
            <div>
              <Label htmlFor="name" className="mb-1.5 block text-xs">
                Full Name
              </Label>
              <Input id="name" name="name" required />
            </div>
          )}
          {mode !== "update-password" && (
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-xs">
                Email
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>
          )}
          {mode !== "reset" && (
            <div>
              <Label htmlFor="password" className="mb-1.5 block text-xs">
                {mode === "update-password" ? "New Password" : "Password"}
              </Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
          )}
          {mode === "login" && (
            <div className="text-right">
              <Link
                to="/auth/$mode"
                params={{ mode: "reset" }}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Please wait…" : meta.cta}
          </button>
          {meta.alt && (
            <p className="text-center text-xs text-muted-foreground">
              {meta.alt.text}{" "}
              <Link to={meta.alt.href} className="font-semibold text-primary hover:underline">
                {meta.alt.label}
              </Link>
            </p>
          )}
        </form>
      </Container>
    </AppShell>
  );
}
