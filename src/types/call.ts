export type { CallChannel, CallPurpose, MonthlyBudget } from "@/config/booking";
import type { CallChannel, CallPurpose, MonthlyBudget } from "@/config/booking";
import type { Lead } from "./lead";

export type CallStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ScheduledCall {
  id: string;
  leadId: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  durationMin: number;
  channel: CallChannel;
  meetingUrl: string | null;
  status: CallStatus;
  manageToken: string;
  notes: string | null;
  createdAt: string;
  lead: Lead;
  ics?: string;
  localTime?: string;
}

export interface CreateCallInput {
  startsAt: string;
  timezone: string;
  channel: CallChannel;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  monthlyBudget?: MonthlyBudget;
  purpose: CallPurpose;
  notes?: string;
  privacyAccepted: true;
}

export interface CallsListResponse {
  calls: ScheduledCall[];
  total: number;
  page: number;
  limit: number;
}

export interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface AvailabilityBlock {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string | null;
}

export interface AvailabilityPayload {
  rules: AvailabilityRule[];
  blocks: AvailabilityBlock[];
}
