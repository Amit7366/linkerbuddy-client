export type CtaRequestStatus = "NEW" | "CONTACTED" | "CONVERTED";
export type CtaAiStatus = "PENDING" | "READY" | "FAILED";

export type CtaRecommendationSnapshot = {
  siteId: number;
  domain: string;
  niche: string;
  da: number;
  dr: number;
  traffic: number;
  country: string;
  guest: number;
  tat: string;
  owner: string;
  trend: string;
  fitScore: number;
  reason: string;
};

export type CtaRequestAdmin = {
  id: string;
  email: string;
  niche: string;
  budget: string;
  status: CtaRequestStatus;
  aiStatus: CtaAiStatus;
  summary: string | null;
  strategy: string | null;
  tips: string[];
  recommendations: CtaRecommendationSnapshot[];
  aiError: string | null;
  pickCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CtaRequestListResponse = {
  requests: CtaRequestAdmin[];
  total: number;
  page: number;
  limit: number;
};
