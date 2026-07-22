import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/constants";
import { PRODUCTS, type Product } from "@/data/products";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  detailedItems: Array<CartItem & { product: Product; lineTotal: number }>;
  subtotal: number;
  count: number;
  add: (productId: string, quantity?: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.cart);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = items
      .map((i) => {
        const product = PRODUCTS.find((p) => p.id === i.productId);
        if (!product) return null;
        return { ...i, product, lineTotal: product.salePrice * i.quantity };
      })
      .filter(Boolean) as CartContextValue["detailedItems"];
    const subtotal = detailedItems.reduce((s, i) => s + i.lineTotal, 0);
    const count = detailedItems.reduce((s, i) => s + i.quantity, 0);
    return { items, detailedItems, subtotal, count, add, update, remove, clear };
  }, [items, add, update, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
