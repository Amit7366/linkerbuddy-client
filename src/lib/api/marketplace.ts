import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { SiteListing } from "@/config/landing";

export type MarketplaceFilter =
  | "all"
  | "budget"
  | "authority"
  | "traffic"
  | "India"
  | "General"
  | "highDa";

export type MarketplaceSort =
  | "recommended"
  | "price"
  | "traffic"
  | "dr"
  | "da";

export type MarketplaceListingInput = Omit<SiteListing, "id">;

export interface PaginatedMarketplace {
  listings: SiteListing[];
  total: number;
  page: number;
  limit: number;
}

export interface MarketplaceStats {
  total: number;
  countries: number;
  maxDofollow: number;
}

export interface ListMarketplaceParams {
  q?: string;
  /** @deprecated Prefer `filters` / semantic params */
  filter?: MarketplaceFilter;
  /** Comma-separated keys combined with AND on the server */
  filters?: string;
  country?: string;
  niche?: string;
  dr?: string;
  priceMax?: number;
  trafficMin?: number;
  trafficMax?: number;
  daMin?: number;
  daMax?: number;
  priceMin?: number;
  sort?: MarketplaceSort;
  page?: number;
  limit?: number;
  ids?: number[];
}

function toQuery(params: ListMarketplaceParams = {}): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.filter) search.set("filter", params.filter);
  if (params.filters) search.set("filters", params.filters);
  if (params.country) search.set("country", params.country);
  if (params.niche) search.set("niche", params.niche);
  if (params.dr) search.set("dr", params.dr);
  if (params.priceMax !== undefined) search.set("priceMax", String(params.priceMax));
  if (params.trafficMin !== undefined) search.set("trafficMin", String(params.trafficMin));
  if (params.daMin !== undefined) search.set("daMin", String(params.daMin));
  if (params.daMax !== undefined) search.set("daMax", String(params.daMax));
  if (params.trafficMax !== undefined) search.set("trafficMax", String(params.trafficMax));
  if (params.priceMin !== undefined) search.set("priceMin", String(params.priceMin));
  if (params.sort) search.set("sort", params.sort);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.ids?.length) search.set("ids", params.ids.join(","));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listMarketplace(params?: ListMarketplaceParams) {
  return apiClient<PaginatedMarketplace>(
    `${endpoints.marketplace.list}${toQuery(params)}`,
  );
}

export async function getMarketplaceStats() {
  return apiClient<MarketplaceStats>(endpoints.marketplace.stats);
}

export async function getMarketplaceFacets() {
  return apiClient<{ countries: string[]; niches: string[] }>(endpoints.marketplace.facets);
}

export async function getMarketplaceListing(id: number) {
  return apiClient<SiteListing>(endpoints.marketplace.detail(id));
}

export async function createMarketplaceListing(input: MarketplaceListingInput) {
  return apiClient<SiteListing>(endpoints.marketplace.list, {
    method: "POST",
    body: input,
    auth: true,
  });
}

export async function updateMarketplaceListing(
  id: number,
  input: Partial<MarketplaceListingInput>,
) {
  return apiClient<SiteListing>(endpoints.marketplace.detail(id), {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export async function deleteMarketplaceListing(id: number) {
  return apiClient<{ message: string }>(endpoints.marketplace.detail(id), {
    method: "DELETE",
    auth: true,
  });
}
