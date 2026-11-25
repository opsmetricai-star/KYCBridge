import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin | KYCBridge" };

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!user?.email || !admins.includes(user.email.toLowerCase())) notFound();
  return user.email;
}

async function decide(formData: FormData) {
  "use server";
  const admin = await requireAdmin();
  const p = z.object({ id: z.string().uuid(), action: z.enum(["approve", "reject"]) }).parse(Object.fromEntries(formData));
  const db = createServiceClient();
  const { data: claim } = await db.from("payment_claims").select("*").eq("id", p.id).eq("status", "pending").maybeSingle();
  if (!claim) return;
  if (p.action === "approve") {
    const until = new Date(Date.now() + 30 * 86400000).toISOString();
    await db.from("organizations").update({ plan: claim.plan, plan_renews_at: until }).eq("id", claim.org_id);
    await db.from("notifications").insert({ org_id: claim.org_id, title: "Plan activated", body: `Your ${claim.plan} plan is now active.` });
  }
  await db.from("payment_claims").update({ status: p.action === "approve" ? "approved" : "rejected", reviewed_by: admin, reviewed_at: new Date().toISOString() }).eq("id", claim.id);
  revalidatePath("/admin");
}

export default async function Admin() {
  await requireAdmin();
  const db = createServiceClient();
  const { data } = await db.from("payment_claims").select("*, organizations(name)").order("created_at", { ascending: false }).limit(50);
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-[32px] tracking-tight">Payment claims</h1>
      <p className="text-ink/60">Confirm each order in your Selar dashboard before approving.</p>
      <ul className="mt-6 space-y-3">
        {(data ?? []).map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-bone p-5">
            <div><p className="font-medium">{c.organizations?.name ?? c.org_id} · {c.plan}</p><p className="text-sm text-ink/60">Order {c.order_ref} · {c.payer_email} · {c.status}</p></div>
            {c.status === "pending" && (
              <form action={decide} className="flex gap-2"><input type="hidden" name="id" value={c.id} />
                <button name="action" value="approve" className="btn btn-dark">Approve</button>
                <button name="action" value="reject" className="btn btn-ghost">Reject</button></form>
            )}
          </li>
        ))}
        {!data?.length && <li className="rounded-3xl bg-bone p-10 text-center text-ink/50">No claims.</li>}
      </ul>
    </div>
  );
}
