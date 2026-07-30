import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { CreateLeadInput, Lead } from "@/types/lead";

export async function createLead(input: CreateLeadInput) {
  return apiClient<Lead>(endpoints.leads.create, {
    method: "POST",
    body: input,
  });
}
