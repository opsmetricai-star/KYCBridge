import Link from "next/link";
import { getContext, monthStart } from "@/lib/context";
import { DecisionChart, ScoreChart } from "@/components/Charts";

export const metadata = { title: "Overview | KYCBridge" };

export default async function Overview() {
  const { sb, org, plan, usage } = await getContext();
  const { data: vs } = await sb.from("verifications").select("id,full_name,risk_score,decision,created_at").eq("org_id", org.id).gte("created_at", monthStart()).order("created_at", { ascending: false }).limit(500);
  const { count: openCases } = await sb.from("cases").select("id", { count: "exact", head: true }).eq("org_id", org.id).neq("status", "closed");
  const list = vs ?? [];
  const by = { approve: 0, review: 0, deny: 0 };
  list.forEach((v) => { by[v.decision as keyof typeof by]++; });
  const avg = list.length ? Math.round(list.reduce((s, v) => s + v.risk_score, 0) / list.length) : 0;
  const buckets = ["0-19", "20-39", "40-59", "60-79", "80-100"].map((range, i) => ({ range, count: list.filter((v) => Math.min(4, Math.floor(v.risk_score / 20)) === i).length }));
  const auto = list.length ? Math.round((by.approve / list.length) * 100) : 0;

  const cards = [
    ["Checks this month", `${usage.check} / ${plan.checks}`],
    ["Auto-approval rate", `${auto}%`],
    ["Average risk score", String(avg)],
    ["Open cases", String(openCases ?? 0)],
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-[32px] tracking-tight">Overview</h1><p className="text-ink/60">{org.name} · {plan.name} plan</p></div>
        <Link href="/dashboard/verifications/new" className="btn btn-dark">New verification</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="rounded-3xl bg-bone p-6"><p className="text-sm text-ink/60">{l}</p><p className="mt-2 text-[34px] tracking-tight">{v}</p></div>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-bone p-6"><h2 className="mb-4 text-lg">Decisions</h2>{list.length ? <DecisionChart data={[{ name: "Approved", value: by.approve }, { name: "Review", value: by.review }, { name: "Denied", value: by.deny }]} /> : <Empty />}</div>
        <div className="rounded-3xl bg-bone p-6"><h2 className="mb-4 text-lg">Risk score distribution</h2>{list.length ? <ScoreChart data={buckets} /> : <Empty />}</div>
      </div>
      <div className="mt-4 rounded-3xl bg-bone p-6">
        <h2 className="mb-4 text-lg">Recent verifications</h2>
        {list.length === 0 ? <Empty /> : (
          <ul className="divide-y divide-ink/10">
            {list.slice(0, 6).map((v) => (
              <li key={v.id}><Link href={`/dashboard/verifications/${v.id}`} className="flex items-center justify-between py-3 hover:underline"><span>{v.full_name}</span><span className="text-sm text-ink/60">{v.risk_score} · {v.decision}</span></Link></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Empty() { return <p className="py-10 text-center text-ink/50">No data yet. Run your first verification.</p>; }
