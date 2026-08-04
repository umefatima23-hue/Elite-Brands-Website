import { useState, type ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminTopbar } from "./admin-topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
