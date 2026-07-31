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

export interface ListMarketplaceParams {
  q?: string;
  filter?: MarketplaceFilter;
  sort?: MarketplaceSort;
  page?: number;
  limit?: number;
  ids?: number[];
}

function toQuery(params: ListMarketplaceParams = {}): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.filter) search.set("filter", params.filter);
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
