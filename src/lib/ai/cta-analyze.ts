import { env } from "@/config/env";
import type { SiteListing } from "@/config/landing";
import type {
  AiRecommendation,
  CtaAnalyzeInput,
  CtaAnalyzeResult,
} from "@/types/cta-analyze";

export type { AiRecommendation, CtaAnalyzeInput, CtaAnalyzeResult };

type GeminiPick = {
  siteId: number;
  fitScore: number;
  reason: string;
};

type GeminiPayload = {
  summary: string;
  strategy: string;
  tips: string[];
  recommendations: GeminiPick[];
};

function parseBudgetRange(budget: string): { min: number; max: number } {
  const normalized = budget.replace(/\s/g, "");
  if (normalized.includes("100+") || normalized.endsWith("100+")) {
    return { min: 100, max: Number.POSITIVE_INFINITY };
  }
  if (normalized.includes("50") && normalized.includes("100")) {
    return { min: 50, max: 100 };
  }
  return { min: 30, max: 50 };
}

async function fetchMarketplacePool(): Promise<SiteListing[]> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/marketplace?limit=100&sort=dr`,
    { next: { revalidate: 60 } },
  );
  if (!response.ok) return [];
  const json = (await response.json()) as {
    success: boolean;
    data?: { listings: SiteListing[] };
  };
  return json.success && json.data ? json.data.listings : [];
}

export async function getCandidateListings(
  niche: string,
  budget: string,
): Promise<SiteListing[]> {
  const { min, max } = parseBudgetRange(budget);
  const listings = await fetchMarketplacePool();

  const inBudget = listings.filter((site) => site.guest >= min && site.guest <= max);
  const nicheExact = inBudget.filter((site) => site.niche === niche);
  const pool = nicheExact.length >= 3 ? nicheExact : inBudget;

  return [...pool]
    .sort((a, b) => b.dr - a.dr || b.traffic - a.traffic || a.guest - b.guest)
    .slice(0, 28);
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Could not parse AI response");
  }
}

function fallbackAnalysis(
  input: CtaAnalyzeInput,
  candidates: SiteListing[],
): CtaAnalyzeResult {
  const picks = candidates.slice(0, 5).map((site, index) => ({
    siteId: site.id,
    fitScore: Math.max(72, 96 - index * 4),
    reason: `Strong ${site.niche} fit within your ${input.budget} budget with DR ${site.dr} and ${site.tat} turnaround.`,
    site,
  }));

  return {
    summary: `We matched ${picks.length} placements for ${input.niche} in the ${input.budget} range.`,
    strategy:
      "Prioritize rising-traffic sites first, then fill gaps with stable authority publishers for a balanced campaign mix.",
    tips: [
      "Start with 3–5 placements to test publisher quality.",
      "Prefer Instant TAT when campaign timing is tight.",
      "Mix Admin and Partner inventory for better coverage.",
    ],
    recommendations: picks,
  };
}

async function callGemini(prompt: string, apiKey: string): Promise<GeminiPayload> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            strategy: { type: "STRING" },
            tips: { type: "ARRAY", items: { type: "STRING" } },
            recommendations: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  siteId: { type: "INTEGER" },
                  fitScore: { type: "INTEGER" },
                  reason: { type: "STRING" },
                },
                required: ["siteId", "fitScore", "reason"],
              },
            },
          },
          required: ["summary", "strategy", "tips", "recommendations"],
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) throw new Error("Empty Gemini response");

  const parsed = extractJson(text) as GeminiPayload;
  if (!parsed?.recommendations?.length) throw new Error("No recommendations returned");
  return parsed;
}

export async function analyzeCtaBrief(
  input: CtaAnalyzeInput,
  apiKey: string | undefined,
): Promise<CtaAnalyzeResult> {
  const candidates = await getCandidateListings(input.niche, input.budget);

  if (candidates.length === 0) {
    return {
      summary: `No inventory currently matches ${input.niche} in the ${input.budget} range.`,
      strategy: "Widen the budget slightly or switch niche to unlock more publisher options.",
      tips: [
        "Try the next budget tier for higher DR options.",
        "General niche usually has the deepest inventory.",
      ],
      recommendations: [],
    };
  }

  if (!apiKey) {
    return fallbackAnalysis(input, candidates);
  }

  const inventory = candidates.map((site) => ({
    id: site.id,
    domain: site.domain,
    niche: site.niche,
    da: site.da,
    dr: site.dr,
    traffic: site.traffic,
    country: site.country,
    guest: site.guest,
    insert: site.insert,
    tat: site.tat,
    owner: site.owner,
    trend: site.trend,
  }));

  const prompt = `You are an SEO placement strategist for a guest-post marketplace.
Analyze this buyer brief and recommend the best sites from the inventory JSON only.

Brief:
- Niche: ${input.niche}
- Budget per site: ${input.budget}
- Buyer email: ${input.email}

Inventory (choose only from these ids):
${JSON.stringify(inventory)}

Rules:
- Return 4 to 6 recommendations max.
- fitScore must be 1-100.
- reason must be one concise sentence explaining fit.
- summary: 1-2 sentences about the shortlist quality.
- strategy: 1 sentence campaign approach.
- tips: exactly 3 short actionable tips.
- Prefer higher DR/traffic within budget, rising trend, and Instant TAT when close.
- Never invent domains or ids outside the inventory.`;

  try {
    const ai = await callGemini(prompt, apiKey);
    const byId = new Map(candidates.map((site) => [site.id, site]));

    const recommendations = ai.recommendations
      .map((pick) => {
        const site = byId.get(pick.siteId);
        if (!site) return null;
        return {
          siteId: site.id,
          fitScore: Math.min(100, Math.max(1, Number(pick.fitScore) || 70)),
          reason: String(pick.reason || "").slice(0, 220),
          site,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 6);

    if (recommendations.length === 0) {
      return fallbackAnalysis(input, candidates);
    }

    return {
      summary: String(ai.summary || "").slice(0, 320),
      strategy: String(ai.strategy || "").slice(0, 280),
      tips: (ai.tips || []).map((tip) => String(tip).slice(0, 160)).slice(0, 3),
      recommendations,
    };
  } catch {
    return fallbackAnalysis(input, candidates);
  }
}
