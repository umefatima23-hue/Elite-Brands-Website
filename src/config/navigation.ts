/**
 * Navigation graph — header, mobile, and footer link sets.
 * Keep route strings in sync with files under src/routes/.
 */
export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Brands", href: "/brands" },
  { label: "Collections", href: "/collections" },
  { label: "Outlet", href: "/outlet" },
  { label: "Deals", href: "/deals" },
];

export const utilityNav: NavLink[] = [
  { label: "Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
];

export const footerNav: NavGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Brands", href: "/brands" },
      { label: "Collections", href: "/collections" },
      { label: "Outlet", href: "/outlet" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/policies/shipping" },
      { label: "Returns", href: "/policies/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/policies/privacy" },
      { label: "Terms", href: "/policies/terms" },
    ],
  },
];
