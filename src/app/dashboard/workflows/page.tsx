import { getContext } from "@/lib/context";
import { saveWorkflow } from "../actions";

export const metadata = { title: "Workflows | KYCBridge" };

export default async function Workflows({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const { sb, org } = await getContext();
  const { data: wf } = await sb.from("workflows").select("*").eq("org_id", org.id).maybeSingle();
  const f = "w-28 rounded-full border border-ink/20 bg-white px-4 py-2.5";
  return (
    <div className="max-w-2xl">
      <h1 className="text-[32px] tracking-tight">Decision workflow</h1>
      <p className="mb-6 text-ink/60">Set how risk scores translate into decisions. Changes apply to new verifications.</p>
      <form action={saveWorkflow} className="space-y-6 rounded-3xl bg-bone p-6 sm:p-8">
        <label className="flex flex-wrap items-center justify-between gap-3"><span>Approve automatically when score is below</span><input name="approve_below" type="number" min={0} max={100} defaultValue={wf?.approve_below ?? 30} className={f} /></label>
        <label className="flex flex-wrap items-center justify-between gap-3"><span>Deny automatically when score is at or above</span><input name="deny_at" type="number" min={0} max={100} defaultValue={wf?.deny_at ?? 70} className={f} /></label>
        <label className="flex items-center gap-3"><input name="auto_case" type="checkbox" defaultChecked={wf?.auto_case ?? true} className="h-5 w-5" />Create a case for every review or denial</label>
        <p className="text-sm text-ink/60">Scores in between are sent to manual review. Applicants under 18 are always denied.</p>
        {sp.error && <p role="alert" className="text-sm text-plum">{sp.error}</p>}
        {sp.saved && <p role="status" className="text-sm">Saved.</p>}
        <button className="btn btn-dark">Save workflow</button>
      </form>
    </div>
  );
}
