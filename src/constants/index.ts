/**
 * App-wide constants. Pure values only — no runtime logic.
 */
export const APP_VERSION = "0.1.0";

export const STORAGE_KEYS = {
  cart: "eb:cart:v1",
  wishlist: "eb:wishlist:v1",
  cookieConsent: "eb:cookie-consent:v1",
  recentlyViewed: "eb:recently-viewed:v1",
} as const;

export const QUERY_KEYS = {
  products: "products",
  product: "product",
  brands: "brands",
  collections: "collections",
  cart: "cart",
  user: "user",
} as const;

export const PAGE_SIZE = 24;
