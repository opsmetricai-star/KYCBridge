import { getContext } from "@/lib/context";
import { ScreeningForm } from "@/components/ScreeningForm";
import { addWatchlist, deleteWatchlist } from "../actions";

export const metadata = { title: "Screening | KYCBridge" };

export default async function Screening() {
  const { sb, org } = await getContext();
  const [{ data: list }, { data: recent }] = await Promise.all([
    sb.from("watchlist_entries").select("*").eq("org_id", org.id).order("created_at", { ascending: false }),
    sb.from("screenings").select("id,query_name,matches,created_at").eq("org_id", org.id).order("created_at", { ascending: false }).limit(8),
  ]);
  const f = "rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm";
  return (
    <div className="max-w-4xl">
      <h1 className="text-[32px] tracking-tight">Watchlist screening</h1>
      <p className="mb-6 text-ink/60">Fuzzy-match names against the lists you maintain. Every new verification is also screened automatically.</p>
      <ScreeningForm />
      <div className="mt-4 rounded-3xl bg-bone p-6">
        <h2 className="mb-3 text-lg">Add watchlist entry</h2>
        <form action={addWatchlist} className="flex flex-wrap gap-3">
          <input name="name" required placeholder="Full name" aria-label="Name" className={`${f} min-w-[200px] flex-1`} />
          <select name="list_type" aria-label="List type" className={f}><option value="internal">Internal</option><option value="sanctions">Sanctions</option><option value="pep">PEP</option><option value="adverse_media">Adverse media</option></select>
          <input name="country" maxLength={2} placeholder="Country" aria-label="Country" className={`${f} w-24 uppercase`} />
          <button className="btn btn-dark">Add</button>
        </form>
        <ul className="mt-5 divide-y divide-ink/10">
          {(list ?? []).map((w) => (
            <li key={w.id} className="flex items-center justify-between py-3"><span>{w.name} <span className="text-sm text-ink/50">· {w.list_type}{w.country ? ` · ${w.country}` : ""}</span></span>
              <form action={deleteWatchlist}><input type="hidden" name="id" value={w.id} /><button className="text-sm underline">Remove</button></form></li>
          ))}
          {!list?.length && <li className="py-6 text-center text-ink/50">No entries yet.</li>}
        </ul>
      </div>
      <div className="mt-4 rounded-3xl bg-bone p-6">
        <h2 className="mb-3 text-lg">Recent screenings</h2>
        <ul className="divide-y divide-ink/10 text-[15px]">{(recent ?? []).map((s) => <li key={s.id} className="flex justify-between py-2"><span>{s.query_name}</span><span className="text-ink/60">{(s.matches as unknown[]).length} match(es) · {new Date(s.created_at).toLocaleString()}</span></li>)}{!recent?.length && <li className="py-4 text-ink/50">None yet.</li>}</ul>
      </div>
    </div>
  );
}
