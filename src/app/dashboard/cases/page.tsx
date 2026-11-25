import Link from "next/link";
import { getContext } from "@/lib/context";
import { updateCase } from "../actions";

export const metadata = { title: "Cases | KYCBridge" };

export default async function Cases() {
  const { sb, org } = await getContext();
  const { data } = await sb.from("cases").select("*").eq("org_id", org.id).order("created_at", { ascending: false }).limit(100);
  const f = "rounded-full border border-ink/20 bg-white px-4 py-2 text-sm";
  return (
    <div className="max-w-4xl">
      <h1 className="text-[32px] tracking-tight">Cases</h1>
      <p className="text-ink/60">Cases are created automatically when an applicant needs review or is denied.</p>
      <div className="mt-6 space-y-3">
        {(data ?? []).map((c) => (
          <form key={c.id} action={updateCase} className="rounded-3xl bg-bone p-6">
            <input type="hidden" name="id" value={c.id} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg">{c.title}</p>
              {c.verification_id && <Link className="text-sm underline" href={`/dashboard/verifications/${c.verification_id}`}>Open verification</Link>}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <select name="status" defaultValue={c.status} aria-label="Status" className={f}><option value="open">Open</option><option value="in_review">In review</option><option value="escalated">Escalated</option><option value="closed">Closed</option></select>
              <select name="priority" defaultValue={c.priority} aria-label="Priority" className={f}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
            </div>
            <textarea name="notes" defaultValue={c.notes} rows={2} placeholder="Analyst notes" aria-label="Notes" className="mt-3 w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-sm" />
            <button className="btn btn-dark mt-3">Save</button>
          </form>
        ))}
        {!data?.length && <p className="rounded-3xl bg-bone p-10 text-center text-ink/50">No cases yet.</p>}
      </div>
    </div>
  );
}
