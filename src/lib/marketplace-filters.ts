import type { FilterKey } from "@/config/landing";
import type { ListMarketplaceParams, MarketplaceSort } from "@/lib/api/marketplace";
import type { SortValue } from "@/lib/site-listings";

export type ActiveFilterKey = Exclude<FilterKey, "all">;

export const TOGGLEABLE_FILTERS = [
  "budget",
  "authority",
  "traffic",
  "India",
  "General",
  "highDa",
] as const satisfies readonly ActiveFilterKey[];

const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  IN: "India",
  US: "USA",
  GB: "UK",
  AU: "Australia",
  ES: "Spain",
  DE: "Germany",
  CA: "Canada",
  AE: "UAE",
};

const COUNTRY_ALIASES: Record<string, string> = {
  india: "India",
  in: "India",
  usa: "USA",
  us: "USA",
  "united states": "USA",
  uk: "UK",
  gb: "UK",
  "united kingdom": "UK",
  australia: "Australia",
  au: "Australia",
  spain: "Spain",
  es: "Spain",
  germany: "Germany",
  de: "Germany",
  canada: "Canada",
  ca: "Canada",
  uae: "UAE",
  ae: "UAE",
};

const FILTER_QUERY_KEYS = [
  "filters",
  "country",
  "niche",
  "dr",
  "priceMax",
  "trafficMin",
  "daMin",
  "filter",
] as const;

/** Chip key → shareable URL query fields */
export function filterKeyToParams(key: ActiveFilterKey): Record<string, string> {
  switch (key) {
    case "budget":
      return { priceMax: "50" };
    case "authority":
      return { dr: "40-60" };
    case "traffic":
      return { trafficMin: "10000" };
    case "India":
      return { country: "india" };
    case "General":
      return { niche: "general" };
    case "highDa":
      return { daMin: "50" };
    default:
      return {};
  }
}

export function normalizeCountryParam(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const fromCode = COUNTRY_CODE_TO_NAME[trimmed.toUpperCase()];
  if (fromCode) return fromCode;
  const fromAlias = COUNTRY_ALIASES[trimmed.toLowerCase()];
  if (fromAlias) return fromAlias;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function countryCodeToFilterParam(code: string): string {
  const name = COUNTRY_CODE_TO_NAME[code.toUpperCase()] ?? code;
  return name.toLowerCase();
}

/** Resolve which filter chips are active from the current URL/search params. */
export function parseActiveFilters(params: URLSearchParams): ActiveFilterKey[] {
  const active = new Set<ActiveFilterKey>();

  const filtersCsv = params.get("filters");
  if (filtersCsv) {
    for (const part of filtersCsv.split(",")) {
      const key = part.trim() as ActiveFilterKey;
      if ((TOGGLEABLE_FILTERS as readonly string[]).includes(key)) {
        active.add(key);
      }
    }
  }

  const country = params.get("country")?.trim().toLowerCase();
  if (country === "india" || country === "in") active.add("India");

  const niche = params.get("niche")?.trim().toLowerCase();
  if (niche === "general") active.add("General");

  const dr = params.get("dr")?.trim();
  if (dr === "40-60") active.add("authority");

  const priceMax = params.get("priceMax");
  if (priceMax !== null && Number(priceMax) === 50) active.add("budget");

  const trafficMin = params.get("trafficMin");
  if (trafficMin !== null && Number(trafficMin) >= 10000) active.add("traffic");

  const daMin = params.get("daMin");
  if (daMin !== null && Number(daMin) >= 50) active.add("highDa");

  return TOGGLEABLE_FILTERS.filter((key) => active.has(key));
}

export function parseSortParam(params: URLSearchParams): SortValue {
  const sort = params.get("sort");
  if (
    sort === "recommended" ||
    sort === "price" ||
    sort === "traffic" ||
    sort === "dr" ||
    sort === "da"
  ) {
    return sort;
  }
  return "recommended";
}

export function parseCountryParam(params: URLSearchParams): string | null {
  const country = params.get("country")?.trim();
  if (!country) return null;
  return normalizeCountryParam(country);
}

/** Build shareable search params from active chips + sort (+ optional country override). */
export function buildMarketplaceSearchParams(options: {
  active: readonly ActiveFilterKey[];
  sort: SortValue;
  country?: string | null;
  base?: URLSearchParams;
}): URLSearchParams {
  const next = new URLSearchParams(options.base?.toString() ?? "");

  for (const key of FILTER_QUERY_KEYS) {
    next.delete(key);
  }

  for (const key of options.active) {
    const mapped = filterKeyToParams(key);
    for (const [param, value] of Object.entries(mapped)) {
      next.set(param, value);
    }
  }

  // Preserve/override country when set from navbar and not already implied by India chip
  if (options.country && !options.active.includes("India")) {
    next.set("country", options.country.toLowerCase());
  }

  if (options.sort && options.sort !== "recommended") {
    next.set("sort", options.sort);
  } else {
    next.delete("sort");
  }

  return next;
}

/** Map current URL search params → API list params (AND composition on server). */
export function searchParamsToListParams(
  params: URLSearchParams,
  page?: number,
  limit?: number,
): ListMarketplaceParams {
  const api: ListMarketplaceParams = {
    sort: parseSortParam(params) as MarketplaceSort,
    page,
    limit,
  };

  const country = params.get("country")?.trim();
  if (country) api.country = normalizeCountryParam(country);

  const niche = params.get("niche")?.trim();
  if (niche) api.niche = niche;

  const dr = params.get("dr")?.trim();
  if (dr) api.dr = dr;

  const priceMax = params.get("priceMax");
  if (priceMax !== null && priceMax !== "" && !Number.isNaN(Number(priceMax))) {
    api.priceMax = Number(priceMax);
  }

  const trafficMin = params.get("trafficMin");
  if (trafficMin !== null && trafficMin !== "" && !Number.isNaN(Number(trafficMin))) {
    api.trafficMin = Number(trafficMin);
  }

  const daMin = params.get("daMin");
  if (daMin !== null && daMin !== "" && !Number.isNaN(Number(daMin))) {
    api.daMin = Number(daMin);
  }

  const filtersCsv = params.get("filters")?.trim();
  if (filtersCsv) api.filters = filtersCsv;

  const legacy = params.get("filter")?.trim();
  if (legacy && legacy !== "all") {
    api.filter = legacy as ListMarketplaceParams["filter"];
  }

  return api;
}

export function toggleActiveFilter(
  current: readonly ActiveFilterKey[],
  key: FilterKey,
): ActiveFilterKey[] {
  if (key === "all") return [];
  const set = new Set(current);
  if (set.has(key)) set.delete(key);
  else set.add(key);
  return TOGGLEABLE_FILTERS.filter((item) => set.has(item));
}

export function hasMarketplaceConstraints(params: URLSearchParams): boolean {
  return (
    parseActiveFilters(params).length > 0 ||
    Boolean(params.get("country")?.trim()) ||
    Boolean(params.get("niche")?.trim()) ||
    Boolean(params.get("dr")?.trim()) ||
    Boolean(params.get("priceMax")?.trim()) ||
    Boolean(params.get("trafficMin")?.trim()) ||
    Boolean(params.get("daMin")?.trim()) ||
    Boolean(params.get("filters")?.trim())
  );
}

/** Carry shareable marketplace query params into /inventory links. */
export function buildInventoryHref(params: URLSearchParams, locale?: string): string {
  const next = new URLSearchParams();
  for (const key of [
    ...FILTER_QUERY_KEYS,
    "sort",
  ] as const) {
    const value = params.get(key);
    if (value) next.set(key, value);
  }
  const qs = next.toString();
  const path = locale ? `/${locale}/inventory` : "/inventory";
  return qs ? `${path}?${qs}` : path;
}
