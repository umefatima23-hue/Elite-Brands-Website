import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { Hero } from "@/home/hero";
import { TrustBar } from "@/home/trust-bar";
import { FeaturedBrands } from "@/home/featured-brands";
import { PremiumOutlet } from "@/home/premium-outlet";
import { NewArrivals } from "@/home/new-arrivals";
import { siteConfig } from "@/config/site";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({ title: siteConfig.name, description: siteConfig.description, path: "/" }),
    links: canonical("/"),
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <AppShell>
      <Hero />
      <TrustBar />
      <FeaturedBrands />
      <PremiumOutlet />
      <NewArrivals />
    </AppShell>
  );
}
