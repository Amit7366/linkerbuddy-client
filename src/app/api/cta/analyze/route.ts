import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeCtaBrief } from "@/lib/ai/cta-analyze";
import { attachCtaAnalysis, persistCtaRequest } from "@/lib/ai/cta-persist";
import { CTA_BUDGETS, CTA_NICHES } from "@/config/landing";

const bodySchema = z.object({
  niche: z.enum(CTA_NICHES),
  budget: z.enum(CTA_BUDGETS),
  email: z.string().email().max(160),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid niche, budget, and email." },
      { status: 400 },
    );
  }

  const persistPromise = persistCtaRequest(
    parsed.data,
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
  );

  try {
    const [persisted, result] = await Promise.all([
      persistPromise,
      analyzeCtaBrief(parsed.data, process.env.GEMINI_API_KEY),
    ]);

    if (persisted) {
      await attachCtaAnalysis(persisted.id, persisted.writeToken, result).catch(() => undefined);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const persisted = await persistPromise.catch(() => null);
    if (persisted) {
      await attachCtaAnalysis(
        persisted.id,
        persisted.writeToken,
        {
          summary: "",
          strategy: "",
          tips: [],
          recommendations: [],
        },
        true,
      ).catch(() => undefined);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Couldn’t build your shortlist",
      },
      { status: 500 },
    );
  }
}
