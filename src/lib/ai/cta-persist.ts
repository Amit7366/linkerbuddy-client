import type { CtaAnalyzeInput, CtaAnalyzeResult } from "@/types/cta-analyze";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

type CreatedCtaRequest = {
  id: string;
  writeToken: string;
};

async function parseJson(response: Response) {
  try {
    return (await response.json()) as {
      success?: boolean;
      data?: CreatedCtaRequest;
    };
  } catch {
    return null;
  }
}

export async function persistCtaRequest(
  input: CtaAnalyzeInput,
  clientIp?: string,
): Promise<CreatedCtaRequest | null> {
  const base = apiUrl();
  if (!base) return null;

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (clientIp) headers["X-Forwarded-For"] = clientIp;

    const response = await fetch(`${base}/cta-requests`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });
    const payload = await parseJson(response);
    if (!response.ok || !payload?.success || !payload.data?.id || !payload.data.writeToken) {
      return null;
    }
    return payload.data;
  } catch {
    return null;
  }
}

export async function attachCtaAnalysis(
  id: string,
  writeToken: string,
  result: CtaAnalyzeResult,
  failed = false,
): Promise<void> {
  const base = apiUrl();
  if (!base) return;

  await fetch(`${base}/cta-requests/${id}/analysis`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writeToken,
      failed,
      summary: result.summary,
      strategy: result.strategy,
      tips: result.tips,
      recommendations: result.recommendations.map((item) => ({
        siteId: item.siteId,
        domain: item.site.domain,
        niche: item.site.niche,
        da: item.site.da,
        dr: item.site.dr,
        traffic: item.site.traffic,
        country: item.site.country,
        guest: item.site.guest,
        tat: item.site.tat,
        owner: item.site.owner,
        trend: item.site.trend,
        fitScore: item.fitScore,
        reason: item.reason,
      })),
    }),
  });
}
