/**
 * Placeholder catalogue. Shape mirrors the eventual Supabase schema
 * so components can swap the source without refactoring.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: "unstitched" | "luxury-lawn" | "printed" | "embroidered";
  categoryLabel: string;
  originalPrice: number;
  salePrice: number;
  images: string[];
  fabric: string;
  included: string[];
  inStock: boolean;
  isNew?: boolean;
  isOutlet?: boolean;
  description: string;
  colorHue: number; // for placeholder image gradient
}

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  hue: number;
}

export const BRANDS: Brand[] = [
  { slug: "sana-safinaz", name: "Sana Safinaz", tagline: "Signature luxury lawn", hue: 15 },
  { slug: "gul-ahmed", name: "Gul Ahmed", tagline: "Heritage of Pakistani textiles", hue: 200 },
  { slug: "khaadi", name: "Khaadi", tagline: "Woven with tradition", hue: 340 },
  { slug: "maria-b", name: "Maria B.", tagline: "Modern couture", hue: 280 },
  { slug: "asim-jofa", name: "Asim Jofa", tagline: "Timeless elegance", hue: 40 },
  { slug: "elan", name: "Elan", tagline: "Wearable art", hue: 160 },
];

export const CATEGORIES = [
  { slug: "unstitched", label: "Unstitched" },
  { slug: "luxury-lawn", label: "Luxury Lawn" },
  { slug: "printed", label: "Printed Lawn" },
  { slug: "embroidered", label: "Embroidered" },
] as const;

const mk = (
  i: number,
  name: string,
  brand: Brand,
  category: Product["category"],
  categoryLabel: string,
  originalPrice: number,
  salePrice: number,
  opts: Partial<Product> = {},
): Product => ({
  id: `p-${i}`,
  slug: `${brand.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
  name,
  brand: brand.name,
  brandSlug: brand.slug,
  category,
  categoryLabel,
  originalPrice,
  salePrice,
  images: [
    `ph-${brand.hue}-${i}`,
    `ph-${(brand.hue + 30) % 360}-${i}`,
    `ph-${(brand.hue + 60) % 360}-${i}`,
  ],
  fabric: "100% Pure Printed Lawn",
  included: ["Shirt Front & Back (2.5m)", "Printed Dupatta (2.5m)", "Dyed Trouser (2.5m)"],
  inStock: true,
  description:
    "A refined three-piece unstitched printed lawn ensemble crafted from the season's most coveted collection. Soft hand-feel, breathable weave, and colours designed to last.",
  colorHue: brand.hue,
  ...opts,
});

export const PRODUCTS: Product[] = [
  mk(1, "Rosewood Bloom", BRANDS[0], "luxury-lawn", "Luxury Lawn", 12500, 6490, {
    isOutlet: true,
    isNew: true,
  }),
  mk(2, "Azure Mirage", BRANDS[1], "printed", "Printed Lawn", 8900, 4450, { isOutlet: true }),
  mk(3, "Marigold Court", BRANDS[2], "unstitched", "Unstitched", 7500, 3990, { isNew: true }),
  mk(4, "Ivory Meadow", BRANDS[3], "embroidered", "Embroidered", 15900, 8950, { isOutlet: true }),
  mk(5, "Amber Trellis", BRANDS[4], "luxury-lawn", "Luxury Lawn", 13500, 7290, { isNew: true }),
  mk(6, "Emerald Verse", BRANDS[5], "printed", "Printed Lawn", 9200, 4600, { isOutlet: true }),
  mk(7, "Saffron Sonata", BRANDS[0], "printed", "Printed Lawn", 8200, 3990, { isOutlet: true }),
  mk(8, "Blush Reverie", BRANDS[1], "unstitched", "Unstitched", 6900, 3450),
  mk(9, "Midnight Garden", BRANDS[2], "luxury-lawn", "Luxury Lawn", 14500, 7990, {
    isOutlet: true,
    isNew: true,
  }),
  mk(10, "Peach Sonnet", BRANDS[3], "printed", "Printed Lawn", 8500, 4290, { isNew: true }),
  mk(11, "Tangerine Whisper", BRANDS[4], "embroidered", "Embroidered", 16500, 9490, {
    isOutlet: true,
  }),
  mk(12, "Jade Reverie", BRANDS[5], "unstitched", "Unstitched", 7900, 3990),
  mk(13, "Coral Solstice", BRANDS[0], "embroidered", "Embroidered", 17500, 9990, {
    isOutlet: true,
  }),
  mk(14, "Lilac Prelude", BRANDS[1], "luxury-lawn", "Luxury Lawn", 12900, 6790, { isNew: true }),
  mk(15, "Sepia Nocturne", BRANDS[2], "printed", "Printed Lawn", 7800, 3890, { isOutlet: true }),
  mk(16, "Champagne Dune", BRANDS[3], "unstitched", "Unstitched", 6500, 3290),
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(product: Product, n = 4) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.brandSlug === product.brandSlug)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.brandSlug !== product.brandSlug))
    .slice(0, n);
}
