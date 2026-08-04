import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { BillingProfile } from "@/types/order";

export type UpdateBillingProfileInput = {
  name?: string | null;
  phone?: string | null;
  company?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export async function getBillingProfile() {
  return apiClient<BillingProfile>(endpoints.users.me, { auth: true });
}

export async function updateBillingProfile(input: UpdateBillingProfileInput) {
  return apiClient<BillingProfile>(endpoints.users.me, {
    method: "PATCH",
    body: input,
    auth: true,
  });
}
