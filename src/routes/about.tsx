import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "About",
      description: "Elite Brands is Pakistan's premium multi-brand outlet for original ladies unstitched lawn.",
      path: "/about",
    }),
    links: canonical("/about"),
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Our story" title="About Elite Brands" description="Premium brands, outlet prices — an honest way to shop luxury lawn." />
      <Container className="prose prose-neutral max-w-3xl py-14 text-foreground">
        <p className="text-base leading-relaxed text-muted-foreground">
          Elite Brands is Pakistan's home for original, unstitched printed lawn from the country's most
          coveted design houses — Sana Safinaz, Gul Ahmed, Khaadi, Maria B., Asim Jofa, Elan and more.
          We curate season leftovers, hit articles and exclusive drops, and pass the outlet savings on to you.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { t: "Authenticity", d: "Every article is 100% original — sourced directly from authorised outlets and wholesalers." },
            { t: "Outlet Value", d: "Save up to 60% on premium collections without ever compromising on quality." },
            { t: "Customer First", d: "Free WhatsApp support, nationwide delivery, and cash on delivery you can trust." },
          ].map((v) => (
            <div key={v.t} className="rounded-lg border border-border bg-card p-6 shadow-elite-sm">
              <span className="gold-rule" />
              <h3 className="mt-3 text-xl">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
