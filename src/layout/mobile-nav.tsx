import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect } from "react";
import { primaryNav, utilityNav } from "@/config/navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-hidden="true" />
      <aside className="absolute inset-y-0 left-0 w-[82%] max-w-sm bg-background shadow-elite-lg flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 h-16">
          <span className="font-display text-xl">
            Elite <span className="text-gold">Brands</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile primary">
          <p className="eyebrow mb-3">Shop</p>
          <ul className="space-y-1">
            {primaryNav.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mb-3 mt-8">Account</p>
          <ul className="space-y-1">
            {utilityNav.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-3 text-sm hover:bg-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
