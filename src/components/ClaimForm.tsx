"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClaimForm({ defaultPlan }: { defaultPlan: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fd) });
    const j = await r.json().catch(() => ({}));
    setBad(!r.ok);
    setMsg(r.ok ? "Submitted. We'll activate your plan once the order is verified." : j.error ?? "Failed.");
    if (r.ok) { (e.target as HTMLFormElement).reset(); router.refresh(); }
    setBusy(false);
  }
  const f = "rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm";
  return (
    <form onSubmit={submit} className="flex flex-wrap gap-3">
      <select name="plan" defaultValue={defaultPlan} aria-label="Plan" className={f}><option value="starter">Starter</option><option value="growth">Growth</option><option value="scale">Scale</option></select>
      <input name="order_ref" required minLength={4} placeholder="Selar order reference" aria-label="Selar order reference" className={`${f} min-w-[220px] flex-1`} />
      <button disabled={busy} className="btn btn-dark disabled:opacity-60">{busy ? "Submitting…" : "Submit for verification"}</button>
      {msg && <p role="status" className={`w-full text-sm ${bad ? "text-plum" : ""}`}>{msg}</p>}
    </form>
  );
}
