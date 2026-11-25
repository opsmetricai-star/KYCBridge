import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { planById } from "@/lib/plans";

export interface Usage { check: number; ai_review: number; screening: number }

export function monthStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

/** Loads the signed-in user's profile, org, plan and this month's usage. Redirects when signed out. */
export async function getContext() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.org_id) redirect("/login?setup=1");
  const { data: org } = await sb.from("organizations").select("*").eq("id", profile.org_id).single();
  const plan = planById(org?.plan);
  const { data: events } = await sb.from("usage_events").select("kind").eq("org_id", profile.org_id).gte("created_at", monthStart());
  const usage: Usage = { check: 0, ai_review: 0, screening: 0 };
  (events ?? []).forEach((e: { kind: keyof Usage }) => { usage[e.kind]++; });
  return { sb, user, profile, org, plan, usage };
}

export type Ctx = Awaited<ReturnType<typeof getContext>>;

/** Same as getContext but for API routes: returns null instead of redirecting. */
export async function getApiContext() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.org_id) return null;
  const { data: org } = await sb.from("organizations").select("*").eq("id", profile.org_id).single();
  const plan = planById(org?.plan);
  const { data: events } = await sb.from("usage_events").select("kind").eq("org_id", profile.org_id).gte("created_at", monthStart());
  const usage: Usage = { check: 0, ai_review: 0, screening: 0 };
  (events ?? []).forEach((e: { kind: keyof Usage }) => { usage[e.kind]++; });
  return { sb, user, profile, org, plan, usage };
}
