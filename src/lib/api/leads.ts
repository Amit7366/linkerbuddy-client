import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { CreateLeadInput, Lead, LeadStatus, LeadsListResponse } from "@/types/lead";

export async function createLead(input: CreateLeadInput) {
  return apiClient<Lead>(endpoints.leads.create, {
    method: "POST",
    body: input,
  });
}

export async function listLeads(params?: {
  status?: LeadStatus;
  source?: string;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.source) search.set("source", params.source);
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiClient<LeadsListResponse>(`${endpoints.leads.list}${qs ? `?${qs}` : ""}`, {
    auth: true,
  });
}

export async function getLead(id: string) {
  return apiClient<Lead>(endpoints.leads.detail(id), { auth: true });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return apiClient<Lead>(endpoints.leads.detail(id), {
    method: "PATCH",
    body: { status },
    auth: true,
  });
}

export async function replyToLead(id: string, input: { subject: string; body: string }) {
  return apiClient(endpoints.leads.reply(id), {
    method: "POST",
    body: input,
    auth: true,
  });
}
