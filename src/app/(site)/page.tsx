import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeadArt } from "@/components/HeadArt";
import { UnifiedTabs, AudienceTabs } from "@/components/HomeTabs";

const SIGNALS = ["Risk score", "Disposable email", "Jurisdiction risk", "Watchlist match", "Document check", "Age check", "Phone format", "Address check", "AI case review", "Case created", "Decision threshold", "Audit record"];

const FACTS = [
  ["15", "risk signals scored on every applicant"],
  ["1", "request from application to decision"],
  ["100%", "of AI actions stored with the case"],
  ["5 min", "expiry on every identity document link"],
];

const TABS = [
  { id: "analyze", label: "Analyze", heading: "AI reads every applicant so your analysts do not have to",
    bullets: ["Fifteen weighted signals convert raw applicant data into a transparent risk score", "AI writes a plain-language case summary with the evidence behind it", "Names are screened against your sanctions, PEP and internal lists automatically"],
    chips: ["Risk score", "Case summary", "Watchlist", "Signals"] },
  { id: "predict", label: "Predict", heading: "Predict fraud at application time, before an account exists",
    bullets: ["Throwaway email, implausible age and restricted jurisdictions raise risk instantly", "Missing identity data is treated as risk, not ignored", "Score distribution shows where your portfolio is drifting"],
    chips: ["Email risk", "Age check", "Jurisdiction", "Document check"] },
  { id: "decide", label: "Decide", heading: "Approve, review or deny against thresholds you control",
    bullets: ["Set the approve and deny scores that match your risk appetite", "Every outcome records the signals and thresholds that produced it", "AI recommends approve, request information, escalate or deny, with reasons"],
    chips: ["Approve", "Review", "Deny", "Recommendation"] },
  { id: "automate", label: "Automate", heading: "Automate the queue and keep analysts on the hard cases",
    bullets: ["Clean applicants are approved in the same request that scored them", "High-risk applicants open prioritized cases without manual triage", "Notifications surface denials the moment they happen"],
    chips: ["Auto-approve", "Auto-case", "Notify", "Audit log"] },
];

const AUDIENCE = [
  { id: "banks", label: "Banks", heading: "One risk policy and one audit record across every product line",
    cards: [{ kind: "Platform", title: "Applied AI that prepares every case", href: "/platform/applied-ai" }, { kind: "Who we work with", title: "How banks standardize risk decisions", href: "/who-we-work-with/banks" }, { kind: "Use case", title: "Compliance with an audit trail behind every decision", href: "/use-cases/compliance" }, { kind: "Platform", title: "Decision workflows tuned to your risk appetite", href: "/platform/orchestration" }] },
  { id: "fintechs", label: "Fintechs", heading: "Production-grade KYC from the first customer, scalable to thousands",
    cards: [{ kind: "Platform", title: "Customer onboarding in a single request", href: "/platform/customer-onboarding" }, { kind: "Who we work with", title: "How fintechs scale controls with volume", href: "/who-we-work-with/fintechs" }, { kind: "Use case", title: "Fraud prevention at application time", href: "/use-cases/fraud-prevention" }, { kind: "Platform", title: "Fraud management with adaptive thresholds", href: "/platform/fraud-management" }] },
  { id: "cu", label: "Credit unions", heading: "Faster member approvals and defensible declines, with a lean team",
    cards: [{ kind: "Who we work with", title: "Membership decisions without added friction", href: "/who-we-work-with/credit-unions" }, { kind: "Use case", title: "AI-prepared case review", href: "/use-cases/case-review" }, { kind: "Platform", title: "Watchlist screening that catches name variants", href: "/platform/watchlist-screening" }, { kind: "Use case", title: "Risk monitoring for decision makers", href: "/use-cases/monitoring" }] },
];

const OUTCOMES = [
  ["Revenue", "More qualified customers onboarded", "Clean applicants are approved in the same request that scored them, so conversion is not lost to review queues."],
  ["Cost", "Fewer manual reviews per account", "AI prepares each case with a summary and a recommendation. Analyst time moves from investigation to confirmation."],
  ["Speed", "Decisions in one request", "Scoring, screening and decisioning run together and return a result with its reasons."],
  ["Risk", "Bad actors stopped at the door", "High-risk applicants are denied or escalated before an account opens, with the evidence stored."],
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bone pt-[100px]">
        <div className="mx-auto grid min-h-[640px] max-w-[1320px] items-center gap-6 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="py-12">
            <h1 className="text-[40px] font-normal leading-[1.05] tracking-tight sm:text-[60px] lg:text-[68px]">The AI decision engine for identity risk</h1>
            <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-ink/80">KYCBridge analyzes every applicant, predicts fraud, decides who to approve and automates the review queue. Regulated operators grow faster, lose less to fraud and spend less per account.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-dark">Sign up</Link>
              <Link href="/login" className="btn btn-coral">Log in</Link>
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

      {/* Facts */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1320px] px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {FACTS.map(([v, l]) => (
            <div key={l} className="border-t border-ink/20 py-8 pr-6">
              <p className="text-[64px] leading-none tracking-tight">{v}</p>
              <p className="mt-4 text-[16px] text-ink/70">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engine: analyze / predict / decide / automate */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">The engine</p>
          <h2 className="mt-4 max-w-3xl text-[34px] leading-tight sm:text-[52px]">AI analyzes, predicts, decides and automates</h2>
          <UnifiedTabs tabs={TABS} />
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">Platform</p>
          <h2 className="mt-4 max-w-3xl text-[34px] leading-tight sm:text-[56px]">One platform from first signal to final decision</h2>
          <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink/80">A signal engine, a decision workflow and Applied AI operate as a single system. Each decision is stored with its evidence, so the next one starts better informed.</p>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              { n: "01", t: "Signal engine", d: "Fifteen weighted signals across age, jurisdiction, email, phone, address and documents produce a transparent 0 to 100 risk score.", c: "bg-blush text-ink", h: "/platform/fraud-management" },
              { n: "02", t: "Decision workflows", d: "Your approve and deny thresholds turn scores into automated outcomes, and every review or denial opens a case with priority attached.", c: "bg-coral text-ink", h: "/platform/orchestration" },
              { n: "03", t: "Applied AI", d: "AI reads each case, recommends the next action with reasons and confidence, and stores its output with the record for audit.", c: "bg-plum text-white", h: "/platform/applied-ai" },
            ].map((c) => (
              <Link key={c.n} href={c.h} className={`flex min-h-[420px] flex-col justify-between rounded-3xl p-8 transition hover:-translate-y-1 ${c.c}`}>
                <div className="flex items-start justify-between"><span className="text-xs">{c.n}</span><PlatformIcon n={c.n} /></div>
                <div>
                  <h3 className="text-[30px] leading-tight">{c.t}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed opacity-85">{c.d}</p>
                  <ChevronRight className="mt-6" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Signals */}
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Signals</p>
            <h2 className="mt-4 text-[34px] leading-tight sm:text-[52px]">Every decision starts with measurable evidence</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-ink/80">Signals are weighted, visible and reproducible. Analysts and auditors see exactly which evidence moved the score and by how much.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Age plausibility", "Email risk", "Jurisdiction risk", "ID completeness", "Document image", "Phone format", "Address presence", "Watchlist match", "Machine-pattern email"].map((p, i) => (
              <div key={p} className={`flex aspect-[4/3] items-center justify-center rounded-2xl px-3 text-center text-sm ${i % 4 === 0 ? "bg-coral" : "bg-paper"}`}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Applied AI */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10">
          <p className="eyebrow">Applied AI</p>
          <h2 className="mt-4 max-w-4xl text-[34px] leading-tight sm:text-[52px]">AI that works the queue, not just the dashboard</h2>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink/80">Your risk team should not be the last line of defense. Applied AI handles the analysis so people focus on judgment and accountability.</p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              ["01", "Analyze", "Case analysis", "The model reads applicant data and triggered signals, then writes a summary an analyst can verify in seconds.", "/platform/applied-ai"],
              ["02", "Recommend", "Decision recommendation", "Approve, request information, escalate or deny, with a confidence score and the reasons behind the call.", "/use-cases/case-review"],
              ["03", "Govern", "Policy and audit", "Output is schema-validated, stored with the case and metered per plan. Raw ID numbers are never sent to the model.", "/about/security"],
            ].map(([n, k, t, d, h]) => (
              <Link key={n} href={h} className="flex min-h-[380px] flex-col rounded-3xl bg-bone p-8 transition hover:bg-[#e2e2db]">
                <p className="eyebrow text-ink/60">{n} {k}</p>
                <h3 className="mt-16 text-[30px]">{t}</h3>
                <p className="mt-4 flex-1 text-[16px] leading-relaxed text-ink/75">{d}</p>
                <ChevronRight className="mt-6" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 pb-24 sm:px-10">
          <p className="eyebrow">Who we work with</p>
          <h2 className="mt-4 text-[34px] leading-tight sm:text-[52px]">Purpose-built for regulated operators</h2>
          <AudienceTabs items={AUDIENCE} />
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-bone">
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10">
          <p className="eyebrow">Outcomes</p>
          <h2 className="mt-4 max-w-3xl text-[34px] leading-tight sm:text-[52px]">Four business outcomes, each tied to a mechanism</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {OUTCOMES.map(([k, t, d], i) => (
              <div key={k} className={`flex min-h-[320px] flex-col justify-between rounded-3xl p-8 ${i % 3 === 0 ? "bg-paper" : i % 3 === 1 ? "bg-blush" : "bg-plum text-white"}`}>
                <p className="eyebrow">{k}</p>
                <div><h3 className="text-[24px] leading-snug">{t}</h3><p className="mt-3 text-[15px] leading-relaxed opacity-80">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-coral">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 px-6 py-20 sm:px-10">
          <h2 className="max-w-2xl text-[34px] leading-tight sm:text-[48px]">Put an AI decision engine on your risk queue</h2>
          <div className="flex gap-3"><Link href="/signup" className="btn btn-dark">Sign up</Link><Link href="/login" className="btn btn-light">Log in</Link></div>
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
