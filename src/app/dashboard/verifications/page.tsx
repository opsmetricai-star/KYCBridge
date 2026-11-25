import Link from "next/link";
import { getContext } from "@/lib/context";

export const metadata = { title: "Verifications | KYCBridge" };
const BADGE: Record<string, string> = { approve: "bg-[#cfe3b0]", review: "bg-blush", deny: "bg-plum text-white" };

export default async function Verifications({ searchParams }: { searchParams: Promise<{ q?: string; d?: string }> }) {
  const { q, d } = await searchParams;
  const { sb, org } = await getContext();
  let query = sb.from("verifications").select("id,full_name,email,country,risk_score,decision,entity_type,created_at").eq("org_id", org.id).order("created_at", { ascending: false }).limit(100);
  if (d && ["approve", "review", "deny"].includes(d)) query = query.eq("decision", d);
  if (q) query = query.ilike("full_name", `%${q.replace(/[%_]/g, "")}%`);
  const { data } = await query;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] tracking-tight">Verifications</h1>
        <Link href="/dashboard/verifications/new" className="btn btn-dark arrow">New verification</Link>
      </div>
      <form className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search by name" aria-label="Search by name" className="rounded-full border border-ink/20 bg-white px-5 py-2.5" />
        <select name="d" defaultValue={d ?? ""} aria-label="Decision" className="rounded-full border border-ink/20 bg-white px-5 py-2.5">
          <option value="">All decisions</option><option value="approve">Approved</option><option value="review">Review</option><option value="deny">Denied</option>
        </select>
        <button className="btn btn-ghost">Filter</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-bone">
        <table className="w-full min-w-[640px] text-left text-[15px]">
          <thead className="text-sm text-ink/60"><tr><th className="p-4">Name</th><th>Country</th><th>Type</th><th>Risk</th><th>Decision</th><th>Date</th></tr></thead>
          <tbody>
            {(data ?? []).map((v) => (
              <tr key={v.id} className="border-t border-ink/10 hover:bg-paper/60">
                <td className="p-4"><Link href={`/dashboard/verifications/${v.id}`} className="font-medium underline-offset-2 hover:underline">{v.full_name}</Link><div className="text-xs text-ink/50">{v.email}</div></td>
                <td>{v.country}</td><td className="capitalize">{v.entity_type}</td><td>{v.risk_score}</td>
                <td><span className={`rounded-full px-3 py-1 text-xs capitalize ${BADGE[v.decision]}`}>{v.decision}</span></td>
                <td className="text-ink/60">{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={6} className="p-10 text-center text-ink/50">No verifications found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
