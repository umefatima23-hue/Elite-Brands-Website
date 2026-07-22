import { Link } from "@tanstack/react-router";
import { Container } from "@/components/common/container";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="font-display text-2xl">
              Elite <span className="text-gold">Brands</span>
            </span>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {siteConfig.description}
            </p>
            <span className="gold-rule mt-5" />
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="md:col-span-2">
              <p className="eyebrow mb-4">{group.title}</p>
              <ul className="space-y-2.5">
                {group.links.map((l) => (
                  <li key={`${group.title}-${l.label}`}>
                    <Link
                      to={l.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Stay in touch</p>
            <Newsletter />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="tracking-[0.16em] uppercase">{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
