import { getContext } from "@/lib/context";
import { markAllRead } from "../actions";

export const metadata = { title: "Notifications | KYCBridge" };

export default async function Notifications() {
  const { sb, org } = await getContext();
  const { data } = await sb.from("notifications").select("*").eq("org_id", org.id).order("created_at", { ascending: false }).limit(50);
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between"><h1 className="text-[32px] tracking-tight">Notifications</h1><form action={markAllRead}><button className="btn btn-ghost">Mark all read</button></form></div>
      <ul className="mt-6 space-y-3">
        {(data ?? []).map((n) => (
          <li key={n.id} className={`rounded-3xl p-5 ${n.read ? "bg-bone" : "bg-blush"}`}><p className="font-medium">{n.title}</p>{n.body && <p className="text-[15px] text-ink/75">{n.body}</p>}<p className="mt-1 text-xs text-ink/50">{new Date(n.created_at).toLocaleString()}</p></li>
        ))}
        {!data?.length && <li className="rounded-3xl bg-bone p-10 text-center text-ink/50">Nothing yet.</li>}
      </ul>
    </div>
  );
}
