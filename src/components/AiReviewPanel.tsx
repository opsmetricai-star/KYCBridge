"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AiReview } from "@/lib/gemini";

export function AiReviewPanel({ id, initial }: { id: string; initial: (AiReview & { at?: string }) | null }) {
  const router = useRouter();
  const [review, setReview] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setBusy(true); setErr("");
    const res = await fetch("/api/ai-review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verification_id: id }) });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { setReview(j.review); router.refresh(); } else setErr(j.error ?? "AI review failed.");
    setBusy(false);
  }
  return (
    <div className="rounded-3xl bg-plum p-6 text-white">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg">AI case review</h2>
        <button onClick={run} disabled={busy} className="btn btn-light disabled:opacity-60">{busy ? "Analyzing…" : review ? "Re-run" : "Run AI review"}</button>
      </div>
      {err && <p role="alert" className="mt-4 rounded-xl bg-white/15 p-3 text-sm">{err}</p>}
      {review && (
        <div className="mt-5 space-y-4 text-[15px]">
          <p>{review.summary}</p>
          <p><span className="opacity-70">Recommendation:</span> <b className="capitalize">{review.recommendation.replace(/_/g, " ")}</b> · confidence {Math.round(review.confidence * 100)}%</p>
          <div><p className="opacity-70">Reasons</p><ul className="list-disc pl-5">{review.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
          <div><p className="opacity-70">Next steps</p><ul className="list-disc pl-5">{review.next_steps.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
          <p className="text-xs opacity-60">AI output is decision support. A person makes the final decision.</p>
        </div>
      )}
    </div>
  );
}
