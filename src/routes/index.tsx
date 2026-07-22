import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { PremiumOutlet } from "@/components/home/premium-outlet";
import { NewArrivals } from "@/components/home/new-arrivals";
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
