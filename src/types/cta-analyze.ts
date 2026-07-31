import type { SiteListing } from "@/config/landing";

export type CtaAnalyzeInput = {
  niche: string;
  budget: string;
  email: string;
};

export type AiRecommendation = {
  siteId: number;
  fitScore: number;
  reason: string;
};

export type CtaAnalyzeResult = {
  summary: string;
  strategy: string;
  tips: string[];
  recommendations: Array<AiRecommendation & { site: SiteListing }>;
};
