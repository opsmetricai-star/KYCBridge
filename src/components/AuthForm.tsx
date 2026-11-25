"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "./Logo";

type Mode = "login" | "signup" | "forgot" | "reset";
const TITLES: Record<Mode, string> = { login: "Welcome back", signup: "Create your account", forgot: "Reset your password", reset: "Choose a new password" };

function Inner({ mode }: { mode: Mode }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState(sp.get("setup") ? "Supabase is not configured yet. Add the environment variables from .env.example." : "");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setErr("Supabase is not configured. See README."); return; }
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    const sb = createClient();
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: fd.email, password: fd.password });
        if (error) throw error;
        const next = sp.get("next");
        router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
        router.refresh();
      } else if (mode === "signup") {
        if (fd.password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { data, error } = await sb.auth.signUp({
          email: fd.email, password: fd.password,
          options: { data: { full_name: fd.full_name, company: fd.company }, emailRedirectTo: `${location.origin}/dashboard` },
        });
        if (error) throw error;
        if (data.session) { router.replace("/dashboard"); router.refresh(); }
        else setInfo("Check your email to confirm your account, then log in.");
      } else if (mode === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(fd.email, { redirectTo: `${location.origin}/reset-password` });
        if (error) throw error;
        setInfo("If that email exists, a reset link is on its way.");
      } else {
        if (fd.password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { error } = await sb.auth.updateUser({ password: fd.password });
        if (error) throw error;
        router.replace("/dashboard");
      }
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  const f = "w-full rounded-2xl border border-ink/20 bg-white px-5 py-3 outline-none focus:border-ink";
  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-paper p-8 sm:p-10">
        <Link href="/"><Logo /></Link>
        <h1 className="mt-8 text-[30px] tracking-tight">{TITLES[mode]}</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && <>
            <input name="full_name" required placeholder="Full name" aria-label="Full name" className={f} />
            <input name="company" required placeholder="Company" aria-label="Company" className={f} />
          </>}
          {mode !== "reset" && <input name="email" type="email" required placeholder="Work email" aria-label="Email" autoComplete="email" className={f} />}
          {mode !== "forgot" && <input name="password" type="password" required placeholder={mode === "reset" ? "New password" : "Password"} aria-label="Password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={f} />}
          {err && <p role="alert" className="text-sm text-plum">{err}</p>}
          {info && <p role="status" className="text-sm">{info}</p>}
          <button disabled={busy} className="btn btn-dark w-full justify-center disabled:opacity-60">{busy ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Update password"}</button>
        </form>
        <div className="mt-6 space-y-2 text-sm text-ink/70">
          {mode === "login" && <><p><Link className="underline" href="/forgot-password">Forgot password?</Link></p><p>New here? <Link className="underline" href="/signup">Create an account</Link></p></>}
          {mode === "signup" && <p>Already registered? <Link className="underline" href="/login">Log in</Link></p>}
          {mode === "forgot" && <p><Link className="underline" href="/login">Back to log in</Link></p>}
        </div>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  return <Suspense><Inner mode={mode} /></Suspense>;
}
