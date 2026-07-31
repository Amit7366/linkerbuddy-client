"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listMarketplace } from "@/lib/api/marketplace";

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
  const [priceById, setPriceById] = useState<Record<number, number>>({});

  useEffect(() => {
    if (selectedIds.length === 0) {
      setPriceById({});
      return;
    }

    let cancelled = false;
    void listMarketplace({ ids: selectedIds, limit: 100 })
      .then((data) => {
        if (cancelled) return;
        const next: Record<number, number> = {};
        for (const site of data.listings) {
          next[site.id] = site.guest;
        }
        setPriceById(next);
      })
      .catch(() => {
        if (!cancelled) setPriceById({});
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIds]);

  const value = useMemo<ShortlistContextValue>(() => {
    const total = selectedIds.reduce((sum, id) => sum + (priceById[id] ?? 0), 0);
    return {
      selectedIds,
      toggle: (id: number) =>
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        ),
      clear: () => setSelectedIds([]),
      total,
      count: selectedIds.length,
    };
  }, [priceById, selectedIds]);

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within ShortlistProvider");
  }
  return ctx;
}
