"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, pagesIn } from "@/lib/site";

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
            <Link href={signedIn ? "/dashboard" : "/login"} className="btn btn-ghost hidden whitespace-nowrap sm:inline-flex">{signedIn ? "Dashboard" : "Log in"}</Link>
            {!signedIn && <Link href="/signup" className="btn btn-dark hidden whitespace-nowrap sm:inline-flex">Sign up</Link>}
            <button className="lg:hidden" aria-label="Menu" onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</button>
          </div>
        </div>

        {current && (
          <div className="hidden px-8 pb-8 pt-2 lg:block">
            <p className="eyebrow mb-4 flex items-center gap-2 text-ink/70"><span className="h-2 w-2 rounded-full bg-ink/70" />{current.label}</p>
            <p className="mb-8 max-w-2xl text-[22px] leading-snug">{current.intro}</p>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {pagesIn(current.key).map((p) => (
                <Link key={p.slug} href={`/${p.section}/${p.slug}`} onClick={() => setOpen(null)}
                  className="group flex items-start justify-between gap-4 rounded-2xl bg-bone px-6 py-5 transition hover:bg-[#e2e2db]">
                  <span><span className="block font-medium">{p.title}</span><span className="mt-1 block text-[14px] leading-snug text-ink/60">{p.short}</span></span>
                  <ChevronRight size={16} className="mt-1 shrink-0 transition group-hover:translate-x-1" />
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
              <Link href={signedIn ? "/dashboard" : "/login"} onClick={() => setMobile(false)} className="btn btn-ghost">{signedIn ? "Dashboard" : "Log in"}</Link>
              {!signedIn && <Link href="/signup" onClick={() => setMobile(false)} className="btn btn-dark">Sign up</Link>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
