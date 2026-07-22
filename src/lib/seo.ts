import { siteConfig } from "@/config/site";

interface MetaInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
}

/**
 * Build a TanStack Start `head().meta` array for a route.
 * Keeps title/description/og/twitter tags consistent project-wide.
 */
export function buildMeta({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  type = "website",
}: MetaInput) {
  const fullTitle =
    title === siteConfig.name ? siteConfig.name : `${title} — ${siteConfig.name}`;
  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { property: "og:site_name", content: siteConfig.name },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return meta;
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: path }];
}
