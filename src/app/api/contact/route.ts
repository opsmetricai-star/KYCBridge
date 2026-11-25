import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const schema = z.object({
  kind: z.enum(["demo", "subscribe"]),
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Backend is not configured yet." }, { status: 503 });
  const sb = await createClient();
  const { error } = await sb.from("leads").insert(parsed.data);
  if (error) return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
