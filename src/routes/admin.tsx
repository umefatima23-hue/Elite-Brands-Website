import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/layout/admin-shell";
import { Loading } from "@/common/loading";
import { Container } from "@/common/container";
import { useAuth } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

/** Mirrors public.is_staff()'s role set exactly. */
const STAFF_ROLES = new Set(["super_admin", "admin", "manager", "staff"]);

type StaffCheck =
  | { status: "checking" }
  | { status: "staff" }
  | { status: "not-staff" }
  | { status: "error"; message: string };

function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [staffCheck, setStaffCheck] = useState<StaffCheck>({ status: "checking" });
  const [retryToken, setRetryToken] = useState(0);

  const retry = useCallback(() => setRetryToken((n) => n + 1), []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStaffCheck({ status: "not-staff" });
      return;
    }

    let cancelled = false;
    setStaffCheck({ status: "checking" });

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          // Distinguish "actually unauthorized" from "couldn't check right now" —
          // a transient network/RLS error shouldn't silently bounce a real staff
          // member to the login page.
          const message =
            error.code === "42501"
              ? "You don't have permission to access the admin area."
              : "We couldn't verify your access. Please check your connection and try again.";
          setStaffCheck({ status: "error", message });
          return;
        }

        const isStaff = (data ?? []).some((row) => STAFF_ROLES.has(row.role));
        setStaffCheck({ status: isStaff ? "staff" : "not-staff" });
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, retryToken]);

  useEffect(() => {
    if (staffCheck.status === "not-staff") {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [staffCheck.status, navigate]);

  if (authLoading || staffCheck.status === "checking") {
    return <Loading label="Verifying access" />;
  }

  if (staffCheck.status === "error") {
    return (
      <Container className="max-w-md py-20 text-center">
        <p className="text-sm text-muted-foreground">{staffCheck.message}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </Container>
    );
  }

  if (staffCheck.status !== "staff") {
    // "not-staff" — redirect is already in flight (see effect above); render
    // nothing rather than flashing admin chrome for an unauthorized user.
    return null;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
