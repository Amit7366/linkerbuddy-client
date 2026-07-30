"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { SITE_LISTINGS } from "@/config/landing";

interface ShortlistContextValue {
  selectedIds: number[];
  toggle: (id: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const value = useMemo<ShortlistContextValue>(() => {
    const selected = SITE_LISTINGS.filter((site) => selectedIds.includes(site.id));
    return {
      selectedIds,
      toggle: (id: number) =>
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        ),
      clear: () => setSelectedIds([]),
      total: selected.reduce((sum, site) => sum + site.guest, 0),
      count: selected.length,
    };
  }, [selectedIds]);

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within ShortlistProvider");
  }
  return ctx;
}
