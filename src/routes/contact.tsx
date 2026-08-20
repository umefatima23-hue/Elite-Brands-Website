import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/layout/app-shell";
import { PageHeader } from "@/common/page-header";
import { Container } from "@/common/container";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildMeta({
      title: "Contact",
      description: "Contact Elite Brands customer care.",
      path: "/contact",
    }),
    links: canonical("/contact"),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Reach us"
        title="Contact"
        description="We reply within a few hours, seven days a week."
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <form
            className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-elite-sm"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent — we'll be in touch shortly.");
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Name" name="name" required />
              <Row label="Email" name="email" type="email" required />
            </div>
            <Row label="Subject" name="subject" />
            <div>
              <Label htmlFor="message" className="mb-1.5 block text-xs">
                Message *
              </Label>
              <Textarea id="message" name="message" required rows={6} />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>

          <aside className="space-y-4">
            <a
              href={whatsappUrl("Hi Elite Brands, I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5 shadow-elite-sm hover:bg-accent"
            >
              <MessageCircle className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                <p className="mt-1 text-xs text-muted-foreground">{siteConfig.whatsapp}</p>
              </div>
            </a>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5">
              <Mail className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <p className="mt-1 text-xs text-muted-foreground">{siteConfig.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5">
              <Phone className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">Phone</p>
                <p className="mt-1 text-xs text-muted-foreground">Mon–Sat, 10am – 8pm PKT</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5">
              <MapPin className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">Head Office</p>
                <p className="mt-1 text-xs text-muted-foreground">Karachi, Pakistan</p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </AppShell>
  );
}

function Row({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-1.5 block text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input id={name} name={name} type={type} required={required} />
    </div>
  );
}
