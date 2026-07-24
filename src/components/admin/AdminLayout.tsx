import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  Users,
  Ticket,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Plus,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/brands", label: "Brands", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold shadow-luxe">
        <span className="font-serif text-lg font-semibold">E</span>
      </div>
      <div className="min-w-0">
        <p className="font-serif text-lg leading-none tracking-wide text-sidebar-foreground">
          Elite Brands
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60">
          Atelier · Admin
        </p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 px-3">
      {nav.map((item) => {
        const active =
          pathname === item.to ||
          (item.to !== "/admin" && pathname.startsWith(item.to + "/"));
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              active && "bg-sidebar-accent text-sidebar-foreground",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r bg-gold"
              />
            )}
            <Icon className={cn("h-4 w-4 shrink-0", active && "text-gold")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6">
        <Brand />
      </div>
      <div className="divider-gold mx-6 opacity-40" />
      <div className="flex-1 overflow-y-auto py-6">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh w-full">
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-sidebar-border lg:block">
          <SidebarInner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Open navigation"
                      className="lg:hidden"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 border-r-0 bg-sidebar p-0">
                    <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                    <SidebarInner />
                  </SheetContent>
                </Sheet>
                <span className="hidden font-serif text-sm tracking-[0.2em] text-muted-foreground sm:inline">
                  ELITE BRANDS · ADMIN
                </span>
              </div>

              <div className="relative mx-auto hidden w-full max-w-md md:block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Search products, orders, customers…"
                  aria-label="Search admin"
                  className="h-10 rounded-full border-border bg-secondary pl-9"
                />
              </div>

              <div className="flex items-center gap-2 justify-self-end">
                <Button
                  size="sm"
                  className="hidden bg-gradient-gold text-gold-foreground shadow-luxe hover:opacity-95 sm:inline-flex"
                >
                  <Plus className="mr-1 h-4 w-4" /> New
                </Button>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  <span
                    aria-hidden
                    className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold"
                  />
                </Button>
                <Avatar className="h-9 w-9 border border-gold/50">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    AS
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
            <div className="mx-auto w-full max-w-7xl">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
                <div className="min-w-0">
                  {eyebrow && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                      {eyebrow}
                    </p>
                  )}
                  <h1 className="mt-2 truncate font-serif text-3xl font-medium text-foreground sm:text-4xl">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
              </div>

              <div className="divider-gold mt-6 opacity-60" />

              <div className="mt-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
