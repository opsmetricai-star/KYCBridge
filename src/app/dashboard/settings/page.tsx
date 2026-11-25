import { getContext } from "@/lib/context";
import { saveSettings } from "../actions";

export const metadata = { title: "Settings | KYCBridge" };

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const { profile, org } = await getContext();
  const f = "w-full rounded-2xl border border-ink/20 bg-white px-4 py-3";
  return (
    <div className="max-w-xl">
      <h1 className="text-[32px] tracking-tight">Settings</h1>
      <form action={saveSettings} className="mt-6 space-y-4 rounded-3xl bg-bone p-6 sm:p-8">
        <label className="block text-sm"><span className="mb-1 block text-ink/70">Your name</span><input name="full_name" defaultValue={profile.full_name ?? ""} className={f} /></label>
        <label className="block text-sm"><span className="mb-1 block text-ink/70">Email</span><input value={profile.email ?? ""} disabled className={`${f} opacity-60`} /></label>
        <label className="block text-sm"><span className="mb-1 block text-ink/70">Organization</span><input name="org_name" required defaultValue={org.name} className={f} /></label>
        <p className="text-sm text-ink/60">Role: {profile.role}</p>
        {sp.saved && <p role="status" className="text-sm">Saved.</p>}
        <button className="btn btn-dark">Save changes</button>
      </form>
    </div>
  );
}
