import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiContext } from "@/lib/context";
import { geminiConfigured, reviewCase } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(req: Request) {
  const ctx = await getApiContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({ verification_id: z.string().uuid() }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "verification_id required" }, { status: 400 });
  if (!geminiConfigured()) return NextResponse.json({ error: "AI review is temporarily unavailable." }, { status: 503 });

  const { sb, org, plan, usage } = ctx;
  if (usage.ai_review >= plan.aiReviews) {
    return NextResponse.json({ error: `Monthly limit of ${plan.aiReviews} AI reviews reached. Upgrade to continue.` }, { status: 402 });
  }
  const { data: v } = await sb.from("verifications").select("*").eq("id", body.data.verification_id).eq("org_id", org.id).maybeSingle();
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    // Only send the fields needed for the review; omit the raw ID number.
    const review = await reviewCase({
      applicant: { entity_type: v.entity_type, country: v.country, date_of_birth: v.date_of_birth, id_type: v.id_type, has_document_image: Boolean(v.document_path), channel: v.channel, email_domain: v.email.split("@")[1] },
      risk_score: v.risk_score, system_decision: v.decision, watchlist_hits: v.watchlist_hits, signals: v.signals,
    });
    await sb.from("verifications").update({ ai_review: { ...review, at: new Date().toISOString() } }).eq("id", v.id);
    await sb.from("usage_events").insert({ org_id: org.id, kind: "ai_review" });
    return NextResponse.json({ review });
  } catch (e) {
    console.error("ai-review failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "The AI service could not complete this review. Try again shortly." }, { status: 502 });
  }
}
