"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { listMarketplace } from "@/lib/api/marketplace";
import type { SiteListing } from "@/config/landing";
import {
  clearPersistedCart,
  loadPersistedCart,
  savePersistedCart,
  type CartItem,
  type CartPresentation,
  type CartServiceType,
} from "@/lib/cart-storage";

type ListingPrices = {
  guest: number;
  insert: number;
  listing?: SiteListing;
};

interface CartContextValue {
  items: CartItem[];
  selectedIds: number[];
  count: number;
  total: number;
  presentation: CartPresentation;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggle: (id: number) => void;
  add: (id: number, serviceType?: CartServiceType) => void;
  remove: (id: number) => void;
  setServiceType: (id: number, serviceType: CartServiceType) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  getUnitPrice: (id: number) => number;
  getLineTotal: (id: number) => number;
  getListing: (id: number) => SiteListing | undefined;
  markActive: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function unitPriceFor(item: CartItem, prices: ListingPrices | undefined) {
  if (!prices) return 0;
  return item.serviceType === "guest" ? prices.guest : prices.insert;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [presentation, setPresentation] = useState<CartPresentation>("none");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceById, setPriceById] = useState<Record<number, ListingPrices>>({});

  useEffect(() => {
    const persisted = loadPersistedCart();
    if (persisted && persisted.items.length > 0) {
      setItems(persisted.items);
      setPresentation("float");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      clearPersistedCart();
      setPresentation("none");
      return;
    }
    savePersistedCart(items);
  }, [items, hydrated]);

  useEffect(() => {
    if (items.length === 0) {
      setPriceById({});
      return;
    }
    const ids = items.map((i) => i.listingId);
    let cancelled = false;
    void listMarketplace({ ids, limit: 100 })
      .then((data) => {
        if (cancelled) return;
        const next: Record<number, ListingPrices> = {};
        for (const site of data.listings) {
          next[site.id] = {
            guest: site.guest,
            insert: site.insert,
            listing: site,
          };
        }
        setPriceById(next);
      })
      .catch(() => {
        if (!cancelled) setPriceById({});
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const markActive = useCallback(() => {
    setPresentation("bar");
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const toggle = useCallback((id: number) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.listingId === id);
      if (exists) {
        const next = prev.filter((item) => item.listingId !== id);
        return next;
      }
      return [...prev, { listingId: id, serviceType: "guest", quantity: 1 }];
    });
    setPresentation("bar");
  }, []);

  const add = useCallback((id: number, serviceType: CartServiceType = "guest") => {
    setItems((prev) => {
      if (prev.some((item) => item.listingId === id)) return prev;
      return [...prev, { listingId: id, serviceType, quantity: 1 }];
    });
    setPresentation("bar");
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.listingId !== id));
    setPresentation("bar");
  }, []);

  const setServiceType = useCallback((id: number, serviceType: CartServiceType) => {
    setItems((prev) =>
      prev.map((item) => (item.listingId === id ? { ...item, serviceType } : item)),
    );
    setPresentation("bar");
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    const qty = Math.min(99, Math.max(1, Math.floor(quantity)));
    setItems((prev) =>
      prev.map((item) => (item.listingId === id ? { ...item, quantity: qty } : item)),
    );
    setPresentation("bar");
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setPresentation("none");
    setDrawerOpen(false);
    clearPersistedCart();
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, item) => {
      return sum + unitPriceFor(item, priceById[item.listingId]) * item.quantity;
    }, 0);

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      selectedIds: items.map((i) => i.listingId),
      count,
      total,
      presentation: items.length === 0 ? "none" : presentation,
      drawerOpen,
      openDrawer,
      closeDrawer,
      toggle,
      add,
      remove,
      setServiceType,
      setQuantity,
      clear,
      getUnitPrice: (id: number) => {
        const item = items.find((i) => i.listingId === id);
        if (!item) return 0;
        return unitPriceFor(item, priceById[id]);
      },
      getLineTotal: (id: number) => {
        const item = items.find((i) => i.listingId === id);
        if (!item) return 0;
        return unitPriceFor(item, priceById[id]) * item.quantity;
      },
      getListing: (id: number) => priceById[id]?.listing,
      markActive,
    };
  }, [
    items,
    priceById,
    presentation,
    drawerOpen,
    openDrawer,
    closeDrawer,
    toggle,
    add,
    remove,
    setServiceType,
    setQuantity,
    clear,
    markActive,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

/** @deprecated Prefer useCart — kept for existing marketplace call sites */
export function useShortlist() {
  const cart = useCart();
  return {
    selectedIds: cart.selectedIds,
    toggle: cart.toggle,
    clear: cart.clear,
    total: cart.total,
    count: cart.count,
  };
}

export { CartProvider as ShortlistProvider };
