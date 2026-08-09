import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type {
  AdminReviewsResponse,
  AdminReview,
  CreateReviewPayload,
  MyReviewsResponse,
  PublicReviewsResponse,
  UserReview,
} from "@/types/review";

export async function getPublicReviews(limit = 8) {
  return apiClient<PublicReviewsResponse>(
    `${endpoints.reviews.list}?limit=${limit}`,
  );
}

export async function getMyReviews() {
  return apiClient<MyReviewsResponse>(endpoints.reviews.me, { auth: true });
}

export async function createReview(payload: CreateReviewPayload) {
  return apiClient<UserReview>(endpoints.reviews.create, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function listAdminReviews(params?: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return apiClient<AdminReviewsResponse>(
    `${endpoints.reviews.admin}${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export interface UpdateAdminReviewPayload {
  rating?: number;
  description?: string;
  showOnHome?: boolean;
}

export async function updateAdminReview(
  id: string,
  body: UpdateAdminReviewPayload,
) {
  return apiClient<AdminReview>(endpoints.reviews.adminDetail(id), {
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function updateReviewVisibility(id: string, showOnHome: boolean) {
  return updateAdminReview(id, { showOnHome });
}

export async function deleteAdminReview(id: string) {
  return apiClient<{ id: string }>(endpoints.reviews.adminDetail(id), {
    method: "DELETE",
    auth: true,
  });
}
