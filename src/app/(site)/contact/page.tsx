"use client";
import { useState } from "react";

export default function Contact() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    setState("loading");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "demo", ...fd }) });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { setState("ok"); setMsg("Thanks. We'll be in touch within one business day."); (e.target as HTMLFormElement).reset(); }
    else { setState("error"); setMsg(j.error ?? "Something went wrong."); }
  }
  const f = "w-full rounded-2xl border border-ink/20 bg-white px-5 py-3 outline-none focus:border-ink";
  return (
    <section className="bg-bone pt-[100px]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Schedule a demo</p>
          <h1 className="mt-4 text-[40px] font-normal leading-[1.05] tracking-tight sm:text-[60px]">Talk to the KYCBridge team</h1>
          <p className="mt-6 max-w-lg text-[18px] text-ink/80">Tell us about your onboarding and fraud challenges. We&apos;ll walk you through the platform using your scenarios.</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-3xl bg-paper p-8">
          <input name="name" required placeholder="Full name" className={f} aria-label="Full name" />
          <input name="email" type="email" required placeholder="Work email" className={f} aria-label="Work email" />
          <input name="company" placeholder="Company" className={f} aria-label="Company" />
          <textarea name="message" rows={4} placeholder="What would you like to solve?" className={f} aria-label="Message" />
          <button disabled={state === "loading"} className="btn btn-dark arrow disabled:opacity-60">{state === "loading" ? "Sending…" : "Request demo"}</button>
          {msg && <p role="status" className={state === "error" ? "text-plum" : ""}>{msg}</p>}
        </form>
      </div>
    </section>
  );
}
