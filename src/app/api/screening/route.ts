import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiContext } from "@/lib/context";
import { nameSimilarity } from "@/lib/kyc";

export async function POST(req: Request) {
  const ctx = await getApiContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({ name: z.string().trim().min(2).max(120) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Enter a name of at least 2 characters." }, { status: 400 });
  const { sb, org } = ctx;
  const { data: list } = await sb.from("watchlist_entries").select("*").eq("org_id", org.id);
  const matches = (list ?? [])
    .map((w) => ({ id: w.id, name: w.name, list_type: w.list_type, country: w.country, similarity: Number(nameSimilarity(body.data.name, w.name).toFixed(2)) }))
    .filter((m) => m.similarity >= 0.5)
    .sort((a, b) => b.similarity - a.similarity);
  await sb.from("screenings").insert({ org_id: org.id, query_name: body.data.name, matches });
  await sb.from("usage_events").insert({ org_id: org.id, kind: "screening" });
  return NextResponse.json({ matches, listSize: list?.length ?? 0 });
}
