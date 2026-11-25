import Link from "next/link";
import { Bell, Briefcase, CreditCard, FileCheck2, LayoutDashboard, Search, Settings, SlidersHorizontal } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getContext } from "@/lib/context";
import { signOut } from "./actions";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/verifications", label: "Verifications", icon: FileCheck2 },
  { href: "/dashboard/cases", label: "Cases", icon: Briefcase },
  { href: "/dashboard/screening", label: "Screening", icon: Search },
  { href: "/dashboard/workflows", label: "Workflows", icon: SlidersHorizontal },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sb, org, plan, profile, usage } = await getContext();
  const { count } = await sb.from("notifications").select("id", { count: "exact", head: true }).eq("org_id", org.id).eq("read", false);
  const pct = Math.min(100, Math.round((usage.check / plan.checks) * 100));
  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="border-b border-ink/10 bg-bone lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col p-4 lg:p-5">
          <div className="flex items-center justify-between"><Link href="/"><Logo /></Link></div>
          <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col" aria-label="Dashboard">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] hover:bg-paper">
                <Icon size={17} />{label}
                {label === "Notifications" && !!count && <span className="ml-auto rounded-full bg-coral px-2 text-xs">{count}</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-auto hidden rounded-2xl bg-paper p-4 text-sm lg:block">
            <p className="font-medium">{org.name}</p>
            <p className="text-ink/60">{plan.name} plan</p>
            <div className="mt-3 h-1.5 rounded-full bg-bone"><div className="h-1.5 rounded-full bg-coral" style={{ width: `${pct}%` }} /></div>
            <p className="mt-1 text-xs text-ink/60">{usage.check}/{plan.checks} checks this month</p>
            <p className="mt-3 truncate text-xs text-ink/60">{profile.email}</p>
            <form action={signOut}><button className="mt-2 text-xs underline">Log out</button></form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
