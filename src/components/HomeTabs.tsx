"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Minus, Plus } from "lucide-react";

export interface Tab { id: string; label: string; heading: string; bullets: string[]; chips: string[] }

export function UnifiedTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <div className="mt-12 space-y-3">
      {tabs.map((t) => {
        const open = active === t.id;
        return (
          <div key={t.id} className={`overflow-hidden rounded-3xl transition-all duration-500 ${open ? "bg-white" : "bg-bone"}`}>
            <button onClick={() => setActive(t.id)} aria-expanded={open} className="flex w-full items-center justify-between px-6 py-6 text-left sm:px-10">
              <span className="eyebrow">{t.label}</span>
              {open ? <Minus size={20} /> : <Plus size={20} />}
            </button>
            {open && (
              <div className="grid gap-8 px-6 pb-10 sm:px-10 lg:grid-cols-2">
                <div>
                  <h3 className="text-3xl leading-tight sm:text-4xl">{t.heading}</h3>
                  <ul className="mt-6 space-y-3 text-[17px] text-ink/80">
                    {t.bullets.map((b) => <li key={b} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />{b}</li>)}
                  </ul>
                  <Link href="/signup" className="btn btn-dark mt-8">Sign up</Link>
                </div>
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-bone p-6">
                  <div className="grid w-full max-w-sm grid-cols-2 gap-3 text-[13px]">
                    {t.chips.map((s, i) => (
                      <div key={s} className={`rounded-xl px-4 py-5 ${i % 3 === 0 ? "bg-coral" : i % 3 === 1 ? "bg-blush" : "bg-plum text-white"}`}>{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface Audience { id: string; label: string; heading: string; cards: { kind: string; title: string; href: string }[] }

export function AudienceTabs({ items }: { items: Audience[] }) {
  const [active, setActive] = useState(items[0].id);
  const cur = items.find((i) => i.id === active)!;
  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button key={i.id} onClick={() => setActive(i.id)}
            className={`eyebrow rounded-full px-5 py-3 transition ${active === i.id ? "bg-ink text-white" : "bg-bone hover:bg-[#dfdfd8]"}`}>{i.label}</button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_2fr]">
        <div className="rounded-3xl bg-plum p-8 text-white">
          <p className="eyebrow text-white/70">{cur.label}</p>
          <h3 className="mt-4 text-3xl leading-tight">{cur.heading}</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cur.cards.map((c) => (
            <Link key={c.title} href={c.href} className="flex min-h-[200px] flex-col justify-between rounded-3xl bg-bone p-7 transition hover:bg-[#e2e2db]">
              <span className="eyebrow text-ink/60">{c.kind}</span>
              <span className="text-xl leading-snug">{c.title}</span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
