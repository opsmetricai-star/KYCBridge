import { NextResponse } from "next/server";
import { getApiContext } from "@/lib/context";
import { nameSimilarity, scoreVerification, verificationInput } from "@/lib/kyc";
import { supabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const ctx = await getApiContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sb, user, org, plan, usage } = ctx;

  if (usage.check >= plan.checks) {
    return NextResponse.json({ error: `Monthly limit of ${plan.checks} identity checks reached. Upgrade your plan to continue.` }, { status: 402 });
  }
  const parsed = verificationInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }
  const input = parsed.data;
  // Documents must live in this organisation's folder.
  if (input.document_path && !input.document_path.startsWith(`${org.id}/`)) {
    return NextResponse.json({ error: "Invalid document path." }, { status: 400 });
  }

  const [{ data: list }, { data: wf }] = await Promise.all([
    sb.from("watchlist_entries").select("name,list_type").eq("org_id", org.id),
    sb.from("workflows").select("*").eq("org_id", org.id).maybeSingle(),
  ]);
  const hits = (list ?? []).filter((w) => nameSimilarity(input.full_name, w.name) >= 0.8);
  const scored = scoreVerification(input, hits.length);
  const approveBelow = wf?.approve_below ?? 30;
  const denyAt = wf?.deny_at ?? 70;
  const decision = scored.signals.some((s) => s.code === "underage") || scored.score >= denyAt ? "deny" : scored.score >= approveBelow ? "review" : "approve";

  const { data: row, error } = await sb.from("verifications").insert({
    org_id: org.id, created_by: user.id, entity_type: input.entity_type, channel: input.channel,
    full_name: input.full_name, email: input.email, date_of_birth: input.date_of_birth, country: input.country,
    address: input.address, phone: input.phone, id_type: input.id_type, id_number: input.id_number,
    document_path: input.document_path ?? null, risk_score: scored.score, decision, signals: scored.signals,
    watchlist_hits: hits.length,
  }).select().single();
  if (error) return NextResponse.json({ error: "Could not save verification." }, { status: 500 });

  await sb.from("usage_events").insert({ org_id: org.id, kind: "check" });
  if (decision !== "approve" && (wf?.auto_case ?? true)) {
    await sb.from("cases").insert({
      org_id: org.id, verification_id: row.id, title: `${decision === "deny" ? "Denied" : "Review"}: ${input.full_name}`,
      priority: decision === "deny" ? "high" : "medium",
    });
  }
  if (decision === "deny") {
    await sb.from("notifications").insert({ org_id: org.id, title: "High-risk applicant denied", body: `${input.full_name} scored ${scored.score}/100.` });
  }
  return NextResponse.json({ verification: row });
}
