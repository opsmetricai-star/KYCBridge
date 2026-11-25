"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Menu, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, pagesIn } from "@/lib/site";

const USE_CASE_GROUPS: { title: string; items: string[] }[] = [
  { title: "Full-lifecycle fraud prevention", items: ["ATO fraud", "Business fraud", "Credit fraud", "Fraud ring attacks", "Identity fraud", "Money muling", "New account fraud", "Scams"] },
  { title: "Risk-based authentication", items: ["External account ownership", "Login and device management", "Risk-based authentication", "Step-up verification management"] },
];

export function Navbar({ signedIn = false }: { signedIn?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSec, setMobileSec] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  const current = NAV.find((n) => n.key === open);

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6" onMouseLeave={() => setOpen(null)}>
      <div className={`mx-auto max-w-[1320px] overflow-hidden bg-paper shadow-[0_1px_0_rgba(0,0,0,.04)] transition-all ${open ? "rounded-[28px]" : "rounded-[40px]"}`}>
        <div className="flex h-[56px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="KYCBridge home"><Logo /></Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <button key={n.key} onMouseEnter={() => setOpen(n.key)} onClick={() => setOpen(open === n.key ? null : n.key)}
                aria-expanded={open === n.key}
                className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[15px] hover:bg-bone/70 xl:px-4">
                {n.label}
                <ChevronDown size={14} className={`transition-transform ${open === n.key ? "rotate-180" : ""}`} />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1 text-sm font-semibold sm:flex"><Globe size={14} /> US <ChevronDown size={13} /></span>
            <Link href={signedIn ? "/dashboard" : "/login"} aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-full border border-ink sm:flex"><User size={18} /></Link>
            <Link href="/contact" className="btn btn-dark arrow hidden whitespace-nowrap sm:inline-flex">Schedule a demo</Link>
            <button className="lg:hidden" aria-label="Menu" onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</button>
          </div>
        </div>

        {current && (
          <div className="hidden px-8 pb-8 pt-2 lg:block">
            <p className="eyebrow mb-4 flex items-center gap-2 text-ink/70"><span className="h-2 w-2 rounded-full bg-ink/70" />{current.label}</p>
            <p className="mb-8 max-w-2xl text-[22px] leading-snug">{current.intro}</p>
            {current.key === "use-cases" && (
              <div className="mb-4 space-y-3">
                {USE_CASE_GROUPS.map((g) => (
                  <div key={g.title} className="rounded-2xl bg-bone px-6 py-5">
                    <p className="mb-3 font-medium">{g.title}</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-ink/75">{g.items.map((i) => <span key={i}>{i}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {pagesIn(current.key).map((p) => (
                <Link key={p.slug} href={`/${p.section}/${p.slug}`} onClick={() => setOpen(null)}
                  className="group flex items-start justify-between gap-4 rounded-2xl bg-bone px-6 py-5 transition hover:bg-[#e2e2db]">
                  <span><span className="block font-medium">{p.title}</span><span className="mt-1 block text-[14px] leading-snug text-ink/60">{p.short}</span></span>
                  <span className="mt-1 text-[9px] transition group-hover:translate-x-1">▶</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {mobile && (
          <div className="max-h-[75vh] overflow-y-auto border-t border-ink/10 px-5 pb-6 lg:hidden">
            {NAV.map((n) => (
              <div key={n.key} className="border-b border-ink/10">
                <button className="flex w-full items-center justify-between py-4 text-left text-lg" onClick={() => setMobileSec(mobileSec === n.key ? null : n.key)}>
                  {n.label}<ChevronDown size={16} className={mobileSec === n.key ? "rotate-180" : ""} />
                </button>
                {mobileSec === n.key && (
                  <div className="pb-3">
                    {pagesIn(n.key).map((p) => (
                      <Link key={p.slug} href={`/${p.section}/${p.slug}`} onClick={() => setMobile(false)} className="block py-2 text-[15px] text-ink/75">{p.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/pricing" onClick={() => setMobile(false)} className="block border-b border-ink/10 py-4 text-lg">Pricing</Link>
            <div className="mt-5 flex gap-3">
              <Link href={signedIn ? "/dashboard" : "/login"} className="btn btn-ghost">{signedIn ? "Dashboard" : "Log in"}</Link>
              <Link href="/contact" className="btn btn-dark arrow">Schedule a demo</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
