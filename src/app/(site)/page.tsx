import Link from "next/link";
import { HeadArt } from "@/components/HeadArt";
import { UnifiedTabs, AudienceTabs } from "@/components/HomeTabs";
import { SubscribeForm } from "@/components/SubscribeForm";

const SIGNALS = ["Risk score", "Velocity check", "Bot signal", "Address change", "Email risk", "Document risk", "Watchlist match", "Ad hoc query", "Decision flow", "Onboarding pulse", "Compliance flag", "KYB review", "IP change"];

const STATS = [
  ["90%", "Account openings can be automated"],
  ["35%", "Target reduction in fraud losses"],
  ["5x", "Fraud savings per dollar spent"],
  ["56%", "Target lift in automated approvals"],
];

const TABS = [
  { id: "onb", label: "Onboarding at scale", heading: "Fast, frictionless onboarding that keeps risk low",
    bullets: ["Approve more good customers quickly and confidently", "Cut drop-off by removing friction that adds no protection", "Verify identity across web, mobile, branch and API channels"],
    cta: "Explore onboarding", href: "/use-cases/onboarding", art: "ID check|Risk score|Watchlist|Decision" },
  { id: "fraud", label: "Full-lifecycle fraud prevention", heading: "Stop fraud at the door and long after it",
    bullets: ["Score every application and change event with transparent signals", "Link applicants who share identifiers to expose rings", "Raise cases automatically when risk crosses your threshold"],
    cta: "Explore fraud prevention", href: "/use-cases/fraud-prevention", art: "ATO|Muling|Synthetic ID|Scams" },
  { id: "comp", label: "End-to-end compliance", heading: "Compliance that scales with your customer base",
    bullets: ["Run KYC and KYB with a complete audit trail", "Screen against sanctions, PEP and internal lists", "Manage reviews in one case queue with notes and escalation"],
    cta: "Explore compliance", href: "/use-cases/compliance", art: "KYC|KYB|AML|Cases" },
];

const AUDIENCE = [
  { id: "banks", label: "For banks", heading: "Centralise risk management with consistent, enterprise-grade controls", cta: "See how banks use KYCBridge", href: "/who-we-work-with/banks",
    cards: [{ kind: "Article", title: "Authentication and fraud prevention are converging. Is your team ready?", href: "/resources/blog" }, { kind: "Article", title: "When protection becomes a product feature", href: "/resources/blog" }, { kind: "Case study", title: "A sample programme cuts year-on-year fraud", href: "/resources/client-stories" }, { kind: "Report", title: "State of Fraud: a practitioner's view", href: "/resources/content-library" }] },
  { id: "fintechs", label: "For fintechs", heading: "Launch fast and add controls as you grow", cta: "See how fintechs use KYCBridge", href: "/who-we-work-with/fintechs",
    cards: [{ kind: "Guide", title: "Your first 1,000 verified customers", href: "/resources/content-library" }, { kind: "Article", title: "KYC without the drop-off", href: "/resources/blog" }, { kind: "Case study", title: "From signup to decision in minutes", href: "/resources/client-stories" }, { kind: "Report", title: "Fintech compliance checklist", href: "/resources/content-library" }] },
  { id: "cu", label: "For credit unions", heading: "Protect members without adding friction", cta: "See how credit unions use KYCBridge", href: "/who-we-work-with/credit-unions",
    cards: [{ kind: "Article", title: "Member-first fraud defence", href: "/resources/blog" }, { kind: "Guide", title: "Automating membership onboarding", href: "/resources/content-library" }, { kind: "Case study", title: "Fewer manual reviews, happier members", href: "/resources/client-stories" }, { kind: "Report", title: "Account takeover trends", href: "/resources/content-library" }] },
];

const QUOTES = [
  { q: "Automated decisions let our analysts focus on the genuinely hard cases.", n: "Sample persona", r: "VP of Innovation, regional bank", stat: "74%", sl: "Target reduction in fraud losses" },
  { q: "Seeing clusters of related applications early changes how we respond to attacks.", n: "Sample persona", r: "Head of Risk, lending fintech", stat: "58%", sl: "Target reduction in manual reviews" },
  { q: "The AI summary gives me the confidence to close watchlist alerts faster.", n: "Sample persona", r: "Chief Compliance Officer, credit union", stat: "88%", sl: "Target reduction in review time" },
  { q: "We were onboarding verified users within weeks of starting.", n: "Sample persona", r: "Co-founder, payments startup", stat: "<5 min", sl: "Application decision time" },
  { q: "One policy engine for KYC, KYB and fraud finally gave us a single source of truth.", n: "Sample persona", r: "Digital Product Manager, community bank", stat: "3x", sl: "Digital account opening growth" },
  { q: "Transparent signals made our auditors' lives much easier.", n: "Sample persona", r: "Manager of Digital Strategy", stat: "2x", sl: "Customer conversions" },
];

const ARTICLES = [
  ["Article", "Bypass the buzzwords: five ways AI actually prevents fraud"],
  ["Article", "Data and machine learning in financial fraud prevention"],
  ["Article", "Why authentication and fraud prevention are fusing"],
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-bone pt-[100px]">
        <div className="mx-auto grid min-h-[640px] max-w-[1320px] items-center gap-6 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="py-12">
            <h1 className="text-[44px] font-normal leading-[1.05] tracking-tight sm:text-[64px] lg:text-[72px]">Full-lifecycle identity &amp; fraud intelligence</h1>
            <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-ink/80">KYCBridge is the AI-powered identity and fraud prevention platform that accelerates onboarding, stops fraud and simplifies compliance across the customer lifecycle.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-dark arrow">Schedule a demo</Link>
              <Link href="#platform" className="btn btn-coral arrow">See how it works</Link>
            </div>
          </div>
          <div className="floaty mx-auto aspect-square w-full max-w-[600px]"><HeadArt /></div>
        </div>
        <div className="mx-auto max-w-[1320px] px-6 pb-6 sm:px-10"><p className="text-[17px] font-medium">Built for banks, credit unions and fintechs</p></div>
        <div className="overflow-hidden border-t border-ink/10 py-5">
          <div className="marquee flex w-max gap-3 pr-3">
            {[...SIGNALS, ...SIGNALS].map((s, i) => <span key={i} className="whitespace-nowrap rounded-full border border-ink/20 bg-paper px-5 py-2 text-sm">{s}</span>)}
          </div>
        </div>
      </section>

      {/* 2. Stats */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1320px] gap-px px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {STATS.map(([v, l]) => (
            <div key={v} className="border-t border-ink/20 py-8 pr-6">
              <p className="text-[64px] leading-none tracking-tight">{v}</p>
              <p className="mt-4 text-[16px] text-ink/70">{l}</p>
              <Link href="/resources/client-stories" className="eyebrow mt-6 inline-block text-[11px]">Read story ▶</Link>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-[1320px] px-6 pb-8 text-xs text-ink/50 sm:px-10">Figures are design targets and illustrative benchmarks, not customer results.</p>
      </section>

      {/* 3. Unified risk management */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">Unified risk management</p>
          <h2 className="mt-4 max-w-3xl text-[36px] leading-tight sm:text-[52px]">Accelerate onboarding, stop fraud and simplify compliance</h2>
          <UnifiedTabs tabs={TABS} />
        </div>
      </section>

      {/* 4. Platform */}
      <section id="platform" className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">Platform</p>
          <h2 className="mt-4 max-w-3xl text-[36px] leading-tight sm:text-[56px]">End-to-end risk management starts here</h2>
          <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink/80">KYCBridge&apos;s open data network, orchestration engine and Applied AI form one platform that gets smarter with every signal and every decision.</p>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              { n: "01", t: "Open data ecosystem", d: "Connect a growing network of partner solutions. A vendor-neutral approach lets you integrate the best providers, compare how they perform and swap them as needs change.", c: "bg-blush text-ink", l: "Explore data partners", h: "/platform/data-partners" },
              { n: "02", t: "Orchestration engine", d: "The orchestration layer sits between your data and your intelligence, routing inputs, sequencing vendor calls and managing dependencies across every workflow.", c: "bg-coral text-ink", l: "Explore orchestration", h: "/platform/orchestration" },
              { n: "03", t: "Applied AI", d: "Predictive machine learning and agentic AI help your team focus on what matters. Every step is logged, explainable and tied to your policies.", c: "bg-plum text-white", l: "Explore Applied AI", h: "/platform/applied-ai" },
            ].map((c) => (
              <div key={c.n} className={`flex min-h-[440px] flex-col justify-between rounded-3xl p-8 ${c.c}`}>
                <div className="flex items-start justify-between"><span className="text-xs">{c.n}</span><PlatformIcon n={c.n} /></div>
                <div>
                  <h3 className="text-[30px] leading-tight">{c.t}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed opacity-85">{c.d}</p>
                  <Link href={c.h} className="btn btn-light arrow mt-6">{c.l}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Data partners */}
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Data partners</p>
            <h2 className="mt-4 text-[36px] leading-tight sm:text-[52px]">Access the industry&apos;s broadest ecosystem of identity data</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-ink/80">A vendor-neutral network gives you access to a growing set of partner solutions. Swap, test and optimise as your risk needs evolve.</p>
            <Link href="/platform/data-partners" className="btn btn-dark arrow mt-8">Check out the partner network</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Identity", "Device", "Email", "Phone", "Address", "Sanctions", "PEP", "Documents", "Business", "Consortium", "Biometrics", "Open banking"].map((p, i) => (
              <div key={p} className={`flex aspect-[4/3] items-center justify-center rounded-2xl text-sm ${i % 5 === 0 ? "bg-coral" : "bg-paper"}`}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Applied AI */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10">
          <p className="eyebrow">Applied AI</p>
          <h2 className="mt-4 max-w-4xl text-[36px] leading-tight sm:text-[52px]">Predict, detect and triage with a suite of Applied AI tools</h2>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink/80">Your fraud team should not be the last line of defence. Native AI handles scoring, detection and case review so people can focus on judgement.</p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              ["01", "Agentic AI", "AI case reviewer", "Reads case triggers and recommends next steps, so review and compliance operations scale without adding headcount.", "/platform/applied-ai"],
              ["02", "Fraud intelligence", "Attack radar", "Portfolio-level alerts for coordinated attacks, so large-scale fraud is stopped before it reaches your funnel.", "/platform/fraud-management"],
              ["03", "Predictive AI", "Risk signal", "An identity-centred model predicts fraud risk from the first touch through every later interaction.", "/platform/identity-verification"],
            ].map(([n, k, t, d, h]) => (
              <div key={n} className="flex min-h-[380px] flex-col rounded-3xl bg-bone p-8">
                <p className="eyebrow text-ink/60">{n} {k}</p>
                <h3 className="mt-16 text-[30px]">{t}</h3>
                <p className="mt-4 flex-1 text-[16px] leading-relaxed text-ink/75">{d}</p>
                <Link href={h} className="eyebrow mt-6 text-[12px]">See how it works ▶</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Who we serve */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">Who we serve</p>
          <h2 className="mt-4 text-[36px] leading-tight sm:text-[52px]">Purpose-built for teams like yours</h2>
          <AudienceTabs items={AUDIENCE} />
        </div>
      </section>

      {/* 8. Results */}
      <section className="bg-bone">
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Results</p>
              <h2 className="mt-4 text-[36px] leading-tight sm:text-[52px]">Outcomes teams are aiming for</h2>
            </div>
            <Link href="/resources/client-stories" className="btn btn-dark arrow">Explore customer stories</Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <figure key={i} className={`flex min-h-[320px] flex-col justify-between rounded-3xl p-8 ${i % 3 === 0 ? "bg-paper" : i % 3 === 1 ? "bg-blush" : "bg-plum text-white"}`}>
                <div><p className="text-[44px] leading-none tracking-tight">{q.stat}</p><p className="mt-2 text-sm opacity-75">{q.sl}</p></div>
                <blockquote className="mt-8 text-[18px] leading-snug">“{q.q}”</blockquote>
                <figcaption className="mt-6 text-sm opacity-75">{q.n}, {q.r}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink/50">Sample content shown for demonstration. Replace with approved customer quotes before launch.</p>
        </div>
      </section>

      {/* 9. Resources */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Resources</p>
              <h2 className="mt-4 text-[36px] leading-tight sm:text-[52px]">Expert insights from the KYCBridge team</h2>
            </div>
            <Link href="/resources/blog" className="btn btn-ghost arrow">Explore more</Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {ARTICLES.map(([k, t]) => (
              <Link key={t} href="/resources/blog" className="flex min-h-[260px] flex-col justify-between rounded-3xl bg-bone p-8 transition hover:bg-[#e2e2db]">
                <span className="eyebrow text-ink/60">{k}</span><span className="text-[22px] leading-snug">{t}</span><span className="eyebrow text-[11px]">Read more ▶</span>
              </Link>
            ))}
          </div>
          <div className="mt-16 rounded-3xl bg-coral p-8 sm:p-12">
            <h3 className="text-[28px]">Subscribe to the blog</h3>
            <p className="mt-2 max-w-xl text-ink/80">Be the first to read new reports and insights on fraud, identity and compliance.</p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}

function PlatformIcon({ n }: { n: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden>
      {n === "01" && <g {...s}><ellipse cx="45" cy="45" rx="40" ry="14" /><ellipse cx="45" cy="45" rx="40" ry="14" transform="rotate(60 45 45)" /><ellipse cx="45" cy="45" rx="40" ry="14" transform="rotate(120 45 45)" /><circle cx="45" cy="45" r="8" /></g>}
      {n === "02" && <g {...s}><circle cx="45" cy="45" r="18" /><ellipse cx="45" cy="45" rx="8" ry="18" />{[[45, 6], [45, 84], [6, 45], [84, 45], [17, 17], [73, 17], [17, 73], [73, 73]].map(([x, y]) => <g key={`${x}${y}`}><line x1="45" y1="45" x2={x} y2={y} /><circle cx={x} cy={y} r="5" fill="var(--coral)" /></g>)}</g>}
      {n === "03" && <g {...s}><path d="M25 70 V55 C12 45 18 20 40 18 C62 16 72 36 62 52 V70 Z" /><circle cx="42" cy="38" r="4" /><path d="M42 42 V56" /></g>}
    </svg>
  );
}
