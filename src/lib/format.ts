import { siteConfig } from "@/config/site";

export function formatPrice(amount: number, currency = siteConfig.currency) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(original: number, sale: number) {
  if (!original || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function savedAmount(original: number, sale: number) {
  return Math.max(0, original - sale);
}
