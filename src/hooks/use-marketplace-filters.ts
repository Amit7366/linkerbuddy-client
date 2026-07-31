"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterKey } from "@/config/landing";
import type { SortValue } from "@/lib/site-listings";
import {
  buildMarketplaceSearchParams,
  countryCodeToFilterParam,
  hasMarketplaceConstraints,
  parseActiveFilters,
  parseCountryParam,
  parseSortParam,
  searchParamsToListParams,
  toggleActiveFilter,
  type ActiveFilterKey,
} from "@/lib/marketplace-filters";

interface UseMarketplaceFiltersOptions {
  /** Keep hash when updating query on the homepage marketplace section */
  hash?: string;
}

export function useMarketplaceFilters(options: UseMarketplaceFiltersOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = useMemo(
    () => parseActiveFilters(searchParams),
    [searchParams],
  );
  const sort = useMemo(() => parseSortParam(searchParams), [searchParams]);
  const country = useMemo(() => parseCountryParam(searchParams), [searchParams]);
  const constrained = useMemo(
    () => hasMarketplaceConstraints(searchParams),
    [searchParams],
  );

  const replaceParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      const hash = options.hash ?? "";
      const href = qs ? `${pathname}?${qs}${hash}` : `${pathname}${hash}`;
      router.replace(href, { scroll: false });
    },
    [options.hash, pathname, router],
  );

  const setFilters = useCallback(
    (nextActive: ActiveFilterKey[], nextSort: SortValue = sort) => {
      const next = buildMarketplaceSearchParams({
        active: nextActive,
        sort: nextSort,
        // Preserve non-India navbar country only while other chips remain active
        country:
          nextActive.includes("India") || nextActive.length === 0
            ? null
            : country && country.toLowerCase() !== "india"
              ? country
              : null,
      });
      replaceParams(next);
    },
    [country, replaceParams, sort],
  );

  const toggleFilter = useCallback(
    (key: FilterKey) => {
      if (key === "all") {
        setFilters([]);
        return;
      }
      setFilters(toggleActiveFilter(active, key));
    },
    [active, setFilters],
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, [setFilters]);

  const setSort = useCallback(
    (nextSort: SortValue) => {
      setFilters(active, nextSort);
    },
    [active, setFilters],
  );

  const setCountryFromNav = useCallback(
    (countryCode: string) => {
      const param = countryCodeToFilterParam(countryCode);
      const next = buildMarketplaceSearchParams({
        active: active.filter((key) => key !== "India"),
        sort,
        country: param,
      });
      // India code should also light up the India chip via country=india
      if (param.toLowerCase() === "india") {
        next.set("country", "india");
      }
      replaceParams(next);
    },
    [active, replaceParams, sort],
  );

  const toApiParams = useCallback(
    (page?: number, limit?: number) =>
      searchParamsToListParams(searchParams, page, limit),
    [searchParams],
  );

  return {
    active,
    sort,
    country,
    constrained,
    toggleFilter,
    clearFilters,
    setSort,
    setCountryFromNav,
    toApiParams,
    isSelected: (key: FilterKey) =>
      key === "all" ? !constrained : active.includes(key as ActiveFilterKey),
  };
}
