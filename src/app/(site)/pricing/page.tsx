import Link from "next/link";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Pricing | KYCBridge" };

const FAQ = [
  ["How do upgrades work?", "Pay through the secure Selar checkout. After payment, enter your Selar order reference in Billing. We verify the order and activate your plan. A redirect alone never changes your plan."],
  ["What counts as an identity check?", "Each verification you submit counts once. Watchlist screenings and AI reviews have their own allowances."],
  ["What happens at my limit?", "New checks and AI reviews pause until the next calendar month or until you upgrade."],
  ["Is my data isolated?", "Yes. Row-level security scopes every record, and ID documents are stored in a private bucket per organisation."],
];

export default function Pricing() {
  return (
    <>
      <section className="bg-bone pt-[100px]">
        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-10">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-4 max-w-3xl text-[40px] font-normal leading-[1.05] tracking-tight sm:text-[64px]">Simple plans that grow with your risk programme</h1>
          <p className="mt-6 max-w-2xl text-[19px] text-ink/80">Start in the sandbox for free, then move up when your volume does.</p>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1320px] gap-4 px-6 py-20 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => {
            const hot = p.id === "growth";
            return (
              <div key={p.id} className={`flex flex-col rounded-3xl p-8 ${hot ? "bg-plum text-white" : "bg-bone"}`}>
                <p className="eyebrow">{p.name}{hot && " · Popular"}</p>
                <p className="mt-6 text-[52px] leading-none tracking-tight">${p.price}<span className="text-base opacity-70"> /mo</span></p>
                <p className="mt-4 min-h-[56px] opacity-80">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3 text-[15px]">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><span>✓</span>{f}</li>)}
                </ul>
                {p.url
                  ? <Link href={`/dashboard/billing?plan=${p.id}`} className={`btn mt-8 justify-center ${hot ? "btn-light" : "btn-dark"}`}>Upgrade to {p.name}</Link>
                  : <Link href="/signup" className="btn btn-ghost mt-8 justify-center">Start free</Link>}
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-bone">
        <div className="mx-auto max-w-[900px] px-6 py-20 sm:px-10">
          <h2 className="text-[34px]">Questions</h2>
          <div className="mt-8 divide-y divide-ink/15">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none justify-between text-lg">{q}<span className="group-open:rotate-45 transition">+</span></summary><p className="mt-3 text-ink/75">{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
