/**
 * Centralized site configuration.
 * Single source of truth for brand metadata, contact info, and social links.
 */
export const siteConfig = {
  name: "Elite Brands",
  tagline: "Premium Brands • Outlet Prices",
  description:
    "Premium multi-brand outlet for original Pakistani ladies unstitched printed lawn and luxury lawn collections.",
  url: "", // TODO: set once a project URL / custom domain is assigned
  locale: "en",
  currency: "PKR",
  email: "support@elitebrands.example",
  whatsapp: "+92xxxxxxxxxx", // placeholder — wire real number in Sprint 02
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
  ogImage: "", // wire when brand creative is ready
} as const;

export type SiteConfig = typeof siteConfig;
