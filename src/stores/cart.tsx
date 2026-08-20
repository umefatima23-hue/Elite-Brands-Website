import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/constants";
import { getProductsByIds } from "@/lib/catalog";
import type { Product } from "@/data/products";

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
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }, [items, hydrated]);

  /*
   * Product details come from the Supabase-backed catalog.
   * The cart itself still stores only product IDs and quantities.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        return;
      }

      const ids = [...new Set(items.map((item) => item.productId))];

      try {
        const loadedProducts = await getProductsByIds(ids);

        if (!cancelled) {
          setProducts(loadedProducts);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const add = useCallback((productId: string, quantity = 1) => {
    if (quantity <= 0) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);

      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [...prev, { productId, quantity }];
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.productId !== productId)
        : prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));

    const detailedItems = items
      .map((item) => {
        const product = productMap.get(item.productId);

        if (!product) return null;

        return {
          ...item,
          product,
          lineTotal: product.salePrice * item.quantity,
        };
      })
      .filter((item): item is CartContextValue["detailedItems"][number] => item !== null);

    const subtotal = detailedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const count = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      detailedItems,
      subtotal,
      count,
      add,
      update,
      remove,
      clear,
    };
  }, [items, products, add, update, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}
