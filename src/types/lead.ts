export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface LeadReply {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  sentBy?: { id: string; name: string | null; email: string } | null;
}

export interface ScheduledCallSummary {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  channel: string;
  status: string;
  meetingUrl: string | null;
  notes: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  company: string | null;
  website: string | null;
  monthlyBudget: string | null;
  purpose: string | null;
  highValue: boolean;
  source: string;
  status: LeadStatus;
  createdAt: string;
  replies?: LeadReply[];
  scheduledCalls?: ScheduledCallSummary[];
  _count?: { replies: number; scheduledCalls: number };
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  company?: string;
  website?: string;
  monthlyBudget?: string;
  purpose?: string;
  privacyAccepted?: boolean;
  source?: string;
}

export interface LeadsListResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}
