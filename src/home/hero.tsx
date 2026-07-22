import { Link } from "@tanstack/react-router";
import { Container } from "@/components/common/container";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, oklch(0.94 0.03 60) 0%, oklch(0.88 0.06 40) 45%, oklch(0.75 0.09 25) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.4),transparent_55%)]"
      />
      <Container className="relative py-20 md:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-primary/80">{siteConfig.tagline}</p>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl leading-[1.02] md:leading-[0.95] text-primary">
            Original Brands.
            <br />
            <span className="text-gold">Outlet Prices.</span>
          </h1>
          <span className="gold-rule mt-6" />
          <p className="mt-5 max-w-xl text-sm sm:text-base md:text-lg text-primary/80">
            The season's most coveted Pakistani unstitched printed lawn — Sana Safinaz,
            Gul Ahmed, Khaadi, Maria B., Asim Jofa &amp; Elan — at up to 60% off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 sm:px-7 sm:py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop the Outlet
            </Link>
            <Link
              to="/brands"
              className="inline-flex items-center rounded-md border border-primary/40 bg-background/70 backdrop-blur px-6 py-3 sm:px-7 sm:py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-background"
            >
              Explore Brands
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
