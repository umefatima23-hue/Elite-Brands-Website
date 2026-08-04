import { Link, useRouterState } from "@tanstack/react-router";
import { adminNav } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="font-display text-lg">
          Elite <span className="text-gold">Admin</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6" aria-label="Admin">
        {adminNav.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
