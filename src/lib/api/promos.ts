import { apiClient } from "./client";
import { endpoints } from "./endpoints";

export type PromoDiscountType = "PERCENT" | "FIXED";

export type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  type: PromoDiscountType;
  value: number;
  minOrderCents: number;
  maxDiscountCents: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromoListResponse = {
  promos: PromoCode[];
  total: number;
  page: number;
  limit: number;
};

export type PromoPayload = {
  code: string;
  description?: string | null;
  type: PromoDiscountType;
  value: number;
  minOrderCents?: number;
  maxDiscountCents?: number | null;
  maxUses?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  active?: boolean;
};

export async function listPromos(params?: {
  q?: string;
  active?: "true" | "false";
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.active) search.set("active", params.active);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiClient<PromoListResponse>(
    `${endpoints.promos.list}${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export async function createPromo(body: PromoPayload) {
  return apiClient<PromoCode>(endpoints.promos.list, {
    method: "POST",
    body,
    auth: true,
  });
}

export async function updatePromo(id: string, body: Partial<PromoPayload>) {
  return apiClient<PromoCode>(endpoints.promos.detail(id), {
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function deletePromo(id: string) {
  return apiClient<{ id: string }>(endpoints.promos.detail(id), {
    method: "DELETE",
    auth: true,
  });
}
