import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type {
  CtaRequestAdmin,
  CtaRequestListResponse,
  CtaRequestStatus,
} from "@/types/cta-request";

export async function listCtaRequests(params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: CtaRequestStatus;
}) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();
  return apiClient<CtaRequestListResponse>(
    `${endpoints.ctaRequests.list}${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export async function updateCtaRequestStatus(
  id: string,
  status: CtaRequestStatus,
) {
  return apiClient<CtaRequestAdmin>(endpoints.ctaRequests.detail(id), {
    method: "PATCH",
    body: { status },
    auth: true,
  });
}
