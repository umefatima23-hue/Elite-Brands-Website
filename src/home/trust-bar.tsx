import { BadgeCheck, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Container } from "@/components/common/container";

const items = [
  { icon: BadgeCheck, title: "100% Original", desc: "Authentic articles, guaranteed." },
  { icon: Truck, title: "Nationwide Delivery", desc: "Fast dispatch across Pakistan." },
  { icon: ShieldCheck, title: "Cash on Delivery", desc: "Pay only when it arrives." },
  { icon: MessageCircle, title: "WhatsApp Support", desc: "Order & queries in seconds." },
];

export function TrustBar() {
  return (
    <section aria-label="Why shop with us" className="border-b border-border bg-surface">
      <Container className="grid grid-cols-2 gap-3 py-8 md:grid-cols-4 md:gap-5 md:py-10">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 shadow-elite-sm"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
              <it.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-foreground">{it.title}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
