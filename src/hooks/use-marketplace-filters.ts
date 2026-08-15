"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterKey } from "@/config/landing";
import type { SortValue } from "@/lib/site-listings";
import {
  buildMarketplaceSearchParams,
  countryCodeToFilterParam,
  customFilterToSearchParams,
  EMPTY_CUSTOM_FILTER,
  hasMarketplaceConstraints,
  isCustomFilterApplied,
  parseActiveFilters,
  parseCountryParam,
  parseCustomFilter,
  parseSortParam,
  searchParamsToListParams,
  toggleActiveFilter,
  type ActiveFilterKey,
  type CustomMarketplaceFilter,
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
  const customFilter = useMemo(
    () => parseCustomFilter(searchParams),
    [searchParams],
  );
  const customActive = useMemo(
    () => isCustomFilterApplied(searchParams),
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
      if (customActive) {
        replaceParams(customFilterToSearchParams(customFilter, nextSort));
        return;
      }
      setFilters(active, nextSort);
    },
    [active, customActive, customFilter, replaceParams, setFilters],
  );

  const setCountryFromNav = useCallback(
    (countryCode: string) => {
      const param = countryCodeToFilterParam(countryCode);
      if (customActive) {
        replaceParams(
          customFilterToSearchParams({ ...customFilter, country: param }, sort),
        );
        return;
      }
      const next = buildMarketplaceSearchParams({
        active: active.filter((key) => key !== "India"),
        sort,
        country: param,
      });
      if (param.toLowerCase() === "india") {
        next.set("country", "india");
      }
      replaceParams(next);
    },
    [active, customActive, customFilter, replaceParams, sort],
  );

  const toggleCountry = useCallback(
    (countryCode: string | null) => {
      if (customActive) {
        if (!countryCode) {
          replaceParams(
            customFilterToSearchParams({ ...customFilter, country: "" }, sort),
          );
          return;
        }
        const param = countryCodeToFilterParam(countryCode);
        const alreadyOn = country?.toLowerCase() === param.toLowerCase();
        replaceParams(
          customFilterToSearchParams(
            { ...customFilter, country: alreadyOn ? "" : param },
            sort,
          ),
        );
        return;
      }

      if (!countryCode) {
        const next = buildMarketplaceSearchParams({
          active: active.filter((key) => key !== "India"),
          sort,
          country: null,
        });
        replaceParams(next);
        return;
      }

      const param = countryCodeToFilterParam(countryCode);
      const alreadyOn = country?.toLowerCase() === param.toLowerCase();
      if (alreadyOn) {
        const next = buildMarketplaceSearchParams({
          active: active.filter((key) => key !== "India"),
          sort,
          country: null,
        });
        replaceParams(next);
        return;
      }

      setCountryFromNav(countryCode);
    },
    [active, country, customActive, customFilter, replaceParams, setCountryFromNav, sort],
  );

  const isCountrySelected = useCallback(
    (countryCode: string) => {
      if (!country) return false;
      return country.toLowerCase() === countryCodeToFilterParam(countryCode).toLowerCase();
    },
    [country],
  );

  const applyCustomFilter = useCallback(
    (filter: CustomMarketplaceFilter) => {
      replaceParams(customFilterToSearchParams(filter, sort));
    },
    [replaceParams, sort],
  );

  const clearCustomFilter = useCallback(() => {
    replaceParams(customFilterToSearchParams(EMPTY_CUSTOM_FILTER, sort));
  }, [replaceParams, sort]);

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
    customFilter,
    customActive,
    applyCustomFilter,
    clearCustomFilter,
    toggleFilter,
    clearFilters,
    setSort,
    setCountryFromNav,
    toggleCountry,
    isCountrySelected,
    toApiParams,
    isSelected: (key: FilterKey) =>
      key === "all" ? !constrained : active.includes(key as ActiveFilterKey),
  };
}
