"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getContext } from "@/lib/context";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/");
}

export async function updateCase(formData: FormData) {
  const { sb, org } = await getContext();
  const p = z.object({
    id: z.string().uuid(),
    status: z.enum(["open", "in_review", "escalated", "closed"]),
    priority: z.enum(["low", "medium", "high"]),
    notes: z.string().max(4000),
  }).parse(Object.fromEntries(formData));
  await sb.from("cases").update({ status: p.status, priority: p.priority, notes: p.notes, updated_at: new Date().toISOString() }).eq("id", p.id).eq("org_id", org.id);
  revalidatePath("/dashboard/cases");
}

export async function saveWorkflow(formData: FormData) {
  const { sb, org } = await getContext();
  const p = z.object({ approve_below: z.coerce.number().int().min(0).max(100), deny_at: z.coerce.number().int().min(0).max(100) }).parse(Object.fromEntries(formData));
  if (p.approve_below >= p.deny_at) redirect("/dashboard/workflows?error=The+approve+threshold+must+be+below+the+deny+threshold");
  await sb.from("workflows").upsert({ org_id: org.id, approve_below: p.approve_below, deny_at: p.deny_at, auto_case: formData.get("auto_case") === "on", updated_at: new Date().toISOString() });
  revalidatePath("/dashboard/workflows");
  redirect("/dashboard/workflows?saved=1");
}

export async function addWatchlist(formData: FormData) {
  const { sb, org } = await getContext();
  const p = z.object({
    name: z.string().trim().min(2).max(120),
    list_type: z.enum(["sanctions", "pep", "adverse_media", "internal"]),
    country: z.string().trim().max(2).optional(),
    notes: z.string().trim().max(500).optional(),
  }).parse(Object.fromEntries(formData));
  await sb.from("watchlist_entries").insert({ org_id: org.id, ...p, country: p.country?.toUpperCase() || null });
  revalidatePath("/dashboard/screening");
}

export async function deleteWatchlist(formData: FormData) {
  const { sb, org } = await getContext();
  const id = z.string().uuid().parse(formData.get("id"));
  await sb.from("watchlist_entries").delete().eq("id", id).eq("org_id", org.id);
  revalidatePath("/dashboard/screening");
}

export async function saveSettings(formData: FormData) {
  const { sb, org, user } = await getContext();
  const p = z.object({ full_name: z.string().trim().max(120), org_name: z.string().trim().min(2).max(120) }).parse(Object.fromEntries(formData));
  await sb.from("profiles").update({ full_name: p.full_name }).eq("id", user.id);
  await sb.from("organizations").update({ name: p.org_name }).eq("id", org.id);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings?saved=1");
}

export async function markAllRead() {
  const { sb, org } = await getContext();
  await sb.from("notifications").update({ read: true }).eq("org_id", org.id).eq("read", false);
  revalidatePath("/dashboard", "layout");
}
