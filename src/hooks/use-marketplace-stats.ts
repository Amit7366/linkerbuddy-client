"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketplaceStats } from "@/lib/api/marketplace";

export const marketplaceStatsQueryKey = ["marketplace", "stats"] as const;

export function useMarketplaceStats() {
  return useQuery({
    queryKey: marketplaceStatsQueryKey,
    queryFn: getMarketplaceStats,
    staleTime: 60_000,
    retry: 1,
  });
}
