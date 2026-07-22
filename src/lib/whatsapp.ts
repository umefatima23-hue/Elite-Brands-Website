import { siteConfig } from "@/config/site";

const number = siteConfig.whatsapp.replace(/\D/g, "");

export function whatsappUrl(message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductMessage(name: string, brand: string, url: string) {
  return `Hi Elite Brands! I'm interested in "${name}" by ${brand}. ${url}`;
}
