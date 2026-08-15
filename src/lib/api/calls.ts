import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type {
  AvailabilityPayload,
  CallStatus,
  CallsListResponse,
  CreateCallInput,
  ScheduledCall,
  TimeSlot,
} from "@/types/call";

export async function listCallSlots(date: string, timezone: string) {
  const search = new URLSearchParams({ date, timezone });
  return apiClient<{ slots: TimeSlot[] }>(`${endpoints.calls.slots}?${search.toString()}`);
}

export async function createCall(input: CreateCallInput) {
  return apiClient<ScheduledCall>(endpoints.calls.create, {
    method: "POST",
    body: input,
  });
}

export async function getManagedCall(token: string) {
  return apiClient<ScheduledCall>(endpoints.calls.manage(token));
}

export async function cancelManagedCall(token: string) {
  return apiClient<ScheduledCall>(endpoints.calls.cancel(token), { method: "POST" });
}

export async function rescheduleManagedCall(
  token: string,
  input: { startsAt: string; timezone?: string },
) {
  return apiClient<ScheduledCall>(endpoints.calls.reschedule(token), {
    method: "POST",
    body: input,
  });
}

export async function listCalls(params?: { status?: CallStatus; page?: number; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiClient<CallsListResponse>(`${endpoints.calls.list}${qs ? `?${qs}` : ""}`, {
    auth: true,
  });
}

export async function updateCall(id: string, input: { status?: CallStatus; notes?: string }) {
  return apiClient<ScheduledCall>(endpoints.calls.detail(id), {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export async function getAvailability() {
  return apiClient<AvailabilityPayload>(endpoints.calls.availability, { auth: true });
}

export async function putAvailability(input: {
  rules: Array<{ dayOfWeek: number; startTime: string; endTime: string; timezone?: string }>;
  blocks?: Array<{ startsAt: string; endsAt: string; reason?: string }>;
}) {
  return apiClient<AvailabilityPayload>(endpoints.calls.availability, {
    method: "PUT",
    body: input,
    auth: true,
  });
}
