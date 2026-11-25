import { getContext } from "@/lib/context";
import { PLANS } from "@/lib/plans";
import { ClaimForm } from "@/components/ClaimForm";

export const metadata = { title: "Billing | KYCBridge" };

export default async function Billing({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const sp = await searchParams;
  const { sb, org, plan, usage } = await getContext();
  const { data: claims } = await sb.from("payment_claims").select("*").eq("org_id", org.id).order("created_at", { ascending: false }).limit(10);
  const meter = (label: string, used: number, max: number) => (
    <div><div className="flex justify-between text-sm"><span>{label}</span><span>{used} / {max}</span></div><div className="mt-1 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-coral" style={{ width: `${Math.min(100, (used / max) * 100)}%` }} /></div></div>
  );
  const pre = PLANS.some((p) => p.id === sp.plan && p.url) ? sp.plan! : "starter";
  return (
    <div className="max-w-5xl">
      <h1 className="text-[32px] tracking-tight">Billing &amp; usage</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-bone p-6"><p className="text-sm text-ink/60">Current plan</p><p className="text-[34px] tracking-tight">{plan.name}</p>{org.plan_renews_at && <p className="text-sm text-ink/60">Active until {new Date(org.plan_renews_at).toLocaleDateString()}</p>}</div>
        <div className="space-y-4 rounded-3xl bg-bone p-6">{meter("Identity checks", usage.check, plan.checks)}{meter("AI reviews", usage.ai_review, plan.aiReviews)}<p className="text-xs text-ink/50">Usage resets on the 1st of each month (UTC).</p></div>
      </div>
      <h2 className="mb-3 mt-10 text-xl">Upgrade</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.filter((p) => p.url).map((p) => (
          <div key={p.id} className={`flex flex-col rounded-3xl p-6 ${p.id === plan.id ? "bg-blush" : "bg-bone"}`}>
            <p className="eyebrow">{p.name}</p><p className="mt-3 text-[40px] leading-none">${p.price}<span className="text-sm opacity-60"> /mo</span></p>
            <ul className="mt-4 flex-1 space-y-1 text-sm">{p.features.map((x) => <li key={x}>✓ {x}</li>)}</ul>
            {p.id === plan.id ? <p className="mt-5 text-sm">Your current plan</p> : <a href={p.url!} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-5 justify-center">Pay on Selar</a>}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-bone p-6">
        <h2 className="text-lg">Already paid?</h2>
        <p className="mb-4 mt-1 text-sm text-ink/70">Plans activate only after the order is confirmed in Selar. Enter your Selar order reference below. Returning from checkout does not upgrade your account by itself.</p>
        <ClaimForm defaultPlan={pre} />
        {!!claims?.length && <ul className="mt-5 divide-y divide-ink/10 text-sm">{claims.map((c) => <li key={c.id} className="flex justify-between py-2"><span>{c.plan} · {c.order_ref}</span><span className="capitalize">{c.status}</span></li>)}</ul>}
      </div>
    </div>
  );
}
