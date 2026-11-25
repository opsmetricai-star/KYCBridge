"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewVerificationForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get("document") as File | null;
      let document_path: string | null = null;
      if (file && file.size > 0) {
        if (file.size > 8 * 1024 * 1024) throw new Error("Document must be under 8 MB.");
        if (!/^(image\/(png|jpe?g|webp)|application\/pdf)$/.test(file.type)) throw new Error("Upload a PNG, JPG, WEBP or PDF.");
        const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
        document_path = `${orgId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await createClient().storage.from("documents").upload(document_path, file, { contentType: file.type });
        if (error) throw new Error("Document upload failed: " + error.message);
      }
      const body = Object.fromEntries([...fd.entries()].filter(([k]) => k !== "document"));
      const res = await fetch("/api/verifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, document_path }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Request failed");
      router.push(`/dashboard/verifications/${j.verification.id}`);
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
      setBusy(false);
    }
  }

  const f = "w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 outline-none focus:border-ink";
  const L = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block text-sm"><span className="mb-1 block text-ink/70">{t}</span>{children}</label>;
  return (
    <form onSubmit={submit} className="mt-8 grid max-w-3xl gap-4 rounded-3xl bg-bone p-6 sm:grid-cols-2 sm:p-8">
      <L t="Full name"><input name="full_name" required className={f} /></L>
      <L t="Email"><input name="email" type="email" required className={f} /></L>
      <L t="Date of birth"><input name="date_of_birth" type="date" required className={f} /></L>
      <L t="Country (ISO-2, e.g. US)"><input name="country" required maxLength={2} className={`${f} uppercase`} /></L>
      <L t="Phone"><input name="phone" className={f} /></L>
      <L t="Address"><input name="address" className={f} /></L>
      <L t="ID type"><select name="id_type" className={f} defaultValue="passport"><option value="passport">Passport</option><option value="national_id">National ID</option><option value="drivers_license">Driver&apos;s licence</option><option value="none">None</option></select></L>
      <L t="ID number"><input name="id_number" className={f} /></L>
      <L t="Entity type"><select name="entity_type" className={f}><option value="individual">Individual (KYC)</option><option value="business">Business (KYB)</option></select></L>
      <L t="Channel"><select name="channel" className={f}><option value="web">Web</option><option value="mobile">Mobile</option><option value="branch">Branch</option><option value="api">API</option></select></L>
      <div className="sm:col-span-2"><L t="ID document image (PNG, JPG, WEBP or PDF, max 8 MB)"><input name="document" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className={f} /></L></div>
      {err && <p role="alert" className="text-sm text-plum sm:col-span-2">{err}</p>}
      <div className="sm:col-span-2"><button disabled={busy} className="btn btn-dark arrow disabled:opacity-60">{busy ? "Running checks…" : "Run verification"}</button></div>
    </form>
  );
}
