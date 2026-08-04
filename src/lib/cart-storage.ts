export type CartServiceType = "guest" | "insert";

export type CartItem = {
  listingId: number;
  serviceType: CartServiceType;
  quantity: number;
};

export type CartPresentation = "none" | "bar" | "float";

export type PersistedCart = {
  items: CartItem[];
  updatedAt: number;
};

export const CART_STORAGE_KEY = "lb_cart_v1";

export function loadPersistedCart(): PersistedCart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedCart;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return {
      items: parsed.items
        .filter(
          (item) =>
            typeof item.listingId === "number" &&
            (item.serviceType === "guest" || item.serviceType === "insert") &&
            typeof item.quantity === "number" &&
            item.quantity >= 1,
        )
        .map((item) => ({
          listingId: item.listingId,
          serviceType: item.serviceType,
          quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))),
        })),
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function savePersistedCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  const payload: PersistedCart = { items, updatedAt: Date.now() };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}

export function clearPersistedCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}
