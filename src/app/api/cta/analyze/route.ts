import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeCtaBrief } from "@/lib/ai/cta-analyze";
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

  const result = await analyzeCtaBrief(parsed.data, process.env.GEMINI_API_KEY);

  return NextResponse.json({ success: true, data: result });
}
