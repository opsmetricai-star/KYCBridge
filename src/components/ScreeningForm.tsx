"use client";
import { useState } from "react";

interface Match { id: string; name: string; list_type: string; country: string | null; similarity: number }

export function ScreeningForm() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<{ matches: Match[]; listSize: number } | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(""); setRes(null);
    const r = await fetch("/api/screening", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setRes(j); else setErr(j.error ?? "Screening failed.");
    setBusy(false);
  }
  return (
    <div className="rounded-3xl bg-bone p-6">
      <form onSubmit={run} className="flex flex-wrap gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder="Name to screen" aria-label="Name to screen" className="min-w-[220px] flex-1 rounded-full border border-ink/20 bg-white px-5 py-3" />
        <button disabled={busy} className="btn btn-dark disabled:opacity-60">{busy ? "Screening…" : "Screen"}</button>
      </form>
      {err && <p role="alert" className="mt-3 text-sm text-plum">{err}</p>}
      {res && (
        <div className="mt-4 text-[15px]">
          {res.listSize === 0 && <p className="text-ink/60">Your watchlist is empty. Add entries below to screen against.</p>}
          {res.listSize > 0 && res.matches.length === 0 && <p>No matches across {res.listSize} entries.</p>}
          <ul className="space-y-2">{res.matches.map((m) => <li key={m.id} className="flex justify-between rounded-2xl bg-paper px-4 py-3"><span>{m.name} <span className="text-ink/50">({m.list_type}{m.country ? `, ${m.country}` : ""})</span></span><b>{Math.round(m.similarity * 100)}%</b></li>)}</ul>
        </div>
      )}
    </div>
  );
}
