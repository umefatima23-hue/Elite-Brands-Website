/**
 * Admin navigation graph — sidebar/topbar link set for the /admin area.
 * Keep route strings in sync with files under src/routes/admin.*.tsx.
 */
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  FolderTree,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: AdminNavLink[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
