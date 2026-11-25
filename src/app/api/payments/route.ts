import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiContext } from "@/lib/context";

/** A user reports a Selar order. This does NOT change the plan; an admin verifies the order in Selar first. */
export async function POST(req: Request) {
  const ctx = await getApiContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({
    plan: z.enum(["starter", "growth", "scale"]),
    order_ref: z.string().trim().min(4).max(80),
    payer_email: z.string().trim().email().optional(),
  }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Enter the plan and your Selar order reference." }, { status: 400 });
  const { error } = await ctx.sb.from("payment_claims").insert({
    org_id: ctx.org.id, user_id: ctx.user.id, plan: body.data.plan, order_ref: body.data.order_ref, payer_email: body.data.payer_email ?? ctx.user.email, status: "pending",
  });
  if (error) {
    const dup = error.code === "23505";
    return NextResponse.json({ error: dup ? "That order reference was already submitted." : "Could not submit payment claim." }, { status: dup ? 409 : 500 });
  }
  return NextResponse.json({ ok: true });
}
