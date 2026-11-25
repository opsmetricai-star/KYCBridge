"use client";
import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "subscribe", email }) });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { setState("ok"); setMsg("You're subscribed."); setEmail(""); }
    else { setState("error"); setMsg(j.error ?? "Something went wrong."); }
  }

  return (
    <form onSubmit={submit} className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="sub-email">Email</label>
      <input id="sub-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
        className="flex-1 rounded-full border border-ink/30 bg-white px-5 py-3 outline-none focus:border-ink" />
      <button disabled={state === "loading"} className="btn btn-dark disabled:opacity-60">{state === "loading" ? "Sending…" : "Subscribe"}</button>
      {msg && <p role="status" className={`self-center text-sm ${state === "error" ? "text-plum" : ""}`}>{msg}</p>}
    </form>
  );
}
