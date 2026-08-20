import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { siteConfig } from "@/config/site";
import { buildMeta, canonical } from "@/lib/seo";

interface PolicyDoc {
  title: string;
  eyebrow: string;
  sections: { heading: string; body: string }[];
}

const POLICIES: Record<string, PolicyDoc> = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Your data",
    sections: [
      {
        heading: "1. Overview",
        body: `Elite Brands ("we", "us") respects your privacy. This policy explains what personal information we collect and how we use it when you visit or purchase from ${siteConfig.name}.`,
      },
      {
        heading: "2. Information We Collect",
        body: "When you place an order or create an account we collect your name, email address, phone number, delivery address and order details. We do not store card details — payment for cash-on-delivery is settled with our courier.",
      },
      {
        heading: "3. How We Use Your Information",
        body: "We use your information to process and deliver orders, to send order confirmations and delivery updates via WhatsApp or email, to respond to customer service requests, and to improve our products and service.",
      },
      {
        heading: "4. Sharing With Third Parties",
        body: "We share your delivery details only with our courier partners to complete your order. We never sell your personal data to advertisers.",
      },
      {
        heading: "5. Cookies",
        body: "We use essential cookies to keep your cart and preferences between visits and, where enabled, anonymous analytics cookies to understand traffic. You may disable cookies in your browser.",
      },
      {
        heading: "6. Your Rights",
        body:
          "You may request access, correction or deletion of your personal data at any time by contacting us at " +
          siteConfig.email +
          ".",
      },
      {
        heading: "7. Contact",
        body: "Questions about this policy? Reach us at " + siteConfig.email + " or via WhatsApp.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    eyebrow: "The fine print",
    sections: [
      {
        heading: "1. Orders",
        body: "All orders are subject to availability and confirmation. We reserve the right to cancel orders in case of pricing errors or stock unavailability.",
      },
      {
        heading: "2. Prices & Payment",
        body: "Prices are listed in PKR and include applicable taxes. Cash on Delivery is currently our primary payment method.",
      },
      {
        heading: "3. Delivery",
        body: "Orders are typically dispatched within 1–3 business days. Delivery times vary by city. We are not liable for courier delays.",
      },
      {
        heading: "4. Ownership",
        body: "All content, imagery and brand names are the property of Elite Brands or the respective brand owners.",
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    eyebrow: "Delivery",
    sections: [
      { heading: "Dispatch", body: "Orders are dispatched within 1–3 business days from Karachi." },
      {
        heading: "Delivery Time",
        body: "3–5 business days to major cities; 5–7 business days for remote areas.",
      },
      {
        heading: "Charges",
        body: "Shipping is free on orders over PKR 5,000. A flat PKR 250 charge applies otherwise.",
      },
      {
        heading: "Tracking",
        body: "You'll receive a WhatsApp update with your tracking number once your order ships.",
      },
    ],
  },
  returns: {
    title: "Returns & Exchange",
    eyebrow: "Peace of mind",
    sections: [
      {
        heading: "Eligibility",
        body: "Unstitched articles may be exchanged within 7 days of delivery, provided the packaging is unopened.",
      },
      {
        heading: "Non-returnable",
        body: "Stitched, altered or washed articles cannot be returned.",
      },
      {
        heading: "How",
        body: "Contact us on WhatsApp with your order number to initiate an exchange.",
      },
    ],
  },
};

export const Route = createFileRoute("/policies/$slug")({
  beforeLoad: ({ params }) => {
    if (!POLICIES[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const doc = POLICIES[params.slug];
    return {
      meta: buildMeta({
        title: doc?.title ?? "Policy",
        description: `${doc?.title ?? "Policy"} — ${siteConfig.name}.`,
        path: `/policies/${params.slug}`,
      }),
      links: canonical(`/policies/${params.slug}`),
    };
  },
  component: PolicyPage,
});

function PolicyPage() {
  const { slug } = Route.useParams();
  const doc = POLICIES[slug]!;
  return (
    <AppShell>
      <PageHeader eyebrow={doc.eyebrow} title={doc.title} />
      <Container className="max-w-3xl py-14">
        <div className="space-y-8">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl text-foreground">{s.heading}</h2>
              <span className="gold-rule mt-3" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
          <p className="pt-8 text-xs text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Container>
    </AppShell>
  );
}
