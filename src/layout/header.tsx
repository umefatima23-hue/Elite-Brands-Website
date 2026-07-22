import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Container } from "@/common/container";
import { primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/stores/cart";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center gap-4 md:h-20">
        <button
          type="button"
          className="md:hidden -ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-baseline gap-2" aria-label={siteConfig.name}>
          <span className="font-display text-2xl md:text-3xl tracking-tight text-foreground">Elite</span>
          <span className="font-display text-2xl md:text-3xl tracking-tight text-gold">Brands</span>
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden md:flex items-center gap-7">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <IconLink label="Search" href="/shop" icon={<Search className="h-5 w-5" />} />
          <IconLink label="Account" href="/auth/login" icon={<User className="h-5 w-5" />} />
          <IconLink label="Wishlist" href="/wishlist" icon={<Heart className="h-5 w-5" />} />
          <Link
            to="/cart"
            aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {count > 0 && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function IconLink({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  return (
    <Link
      to={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon}
    </Link>
  );
}
