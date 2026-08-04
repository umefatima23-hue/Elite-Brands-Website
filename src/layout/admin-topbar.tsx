import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { adminNav } from "@/config/admin-navigation";
import { useAuth } from "@/stores/auth";

interface AdminTopbarProps {
  onOpenMenu: () => void;
}

export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();

  const current =
    adminNav.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
    ) ?? adminNav[0];

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open admin menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 hover:bg-accent hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-medium text-foreground">{current.label}</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
        )}
        <Link
          to="/"
          className="hidden text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground sm:inline"
        >
          View Site
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-accent"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
