import Link from "next/link";
import { notFound } from "next/navigation";
import { getContext } from "@/lib/context";
import { AiReviewPanel } from "@/components/AiReviewPanel";
import type { Signal } from "@/lib/kyc";

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { sb, org } = await getContext();
  const { data: v } = await sb.from("verifications").select("*").eq("id", id).eq("org_id", org.id).maybeSingle();
  if (!v) notFound();
  let docUrl: string | null = null;
  if (v.document_path) {
    const { data } = await sb.storage.from("documents").createSignedUrl(v.document_path, 300);
    docUrl = data?.signedUrl ?? null;
  }
  const signals = (v.signals ?? []) as Signal[];
  const tone = v.decision === "approve" ? "bg-[#cfe3b0]" : v.decision === "review" ? "bg-blush" : "bg-plum text-white";
  return (
    <div className="max-w-4xl">
      <Link href="/dashboard/verifications" className="text-sm underline">← All verifications</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-[32px] tracking-tight">{v.full_name}</h1><p className="text-ink/60">{v.email} · {v.country} · {v.entity_type}</p></div>
        <div className={`rounded-3xl px-6 py-4 text-center ${tone}`}><p className="text-xs uppercase tracking-wider">Decision</p><p className="text-2xl capitalize">{v.decision}</p><p className="text-sm">Risk {v.risk_score}/100</p></div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-bone p-6">
          <h2 className="mb-3 text-lg">Risk signals</h2>
          {signals.length === 0 ? <p className="text-ink/60">No risk signals triggered.</p> : (
            <ul className="space-y-3">{signals.map((s) => <li key={s.code}><p className="flex justify-between"><span>{s.label}</span><span className="text-ink/60">+{s.weight}</span></p><p className="text-sm text-ink/60">{s.detail}</p></li>)}</ul>
          )}
        </div>
        <div className="rounded-3xl bg-bone p-6 text-[15px]">
          <h2 className="mb-3 text-lg">Applicant</h2>
          <dl className="grid grid-cols-[110px_1fr] gap-y-2">
            <dt className="text-ink/60">DOB</dt><dd>{v.date_of_birth}</dd>
            <dt className="text-ink/60">Phone</dt><dd>{v.phone || "—"}</dd>
            <dt className="text-ink/60">Address</dt><dd>{v.address || "—"}</dd>
            <dt className="text-ink/60">ID</dt><dd>{v.id_type}{v.id_number ? ` · ••••${v.id_number.slice(-3)}` : ""}</dd>
            <dt className="text-ink/60">Channel</dt><dd>{v.channel}</dd>
            <dt className="text-ink/60">Watchlist</dt><dd>{v.watchlist_hits} hit(s)</dd>
            <dt className="text-ink/60">Document</dt><dd>{docUrl ? <a className="underline" href={docUrl} target="_blank" rel="noreferrer">View (link expires in 5 min)</a> : "None uploaded"}</dd>
          </dl>
        </div>
      </div>
      <div className="mt-4"><AiReviewPanel id={v.id} initial={v.ai_review} /></div>
    </div>
  );
}
