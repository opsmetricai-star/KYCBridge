import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Pricing | KYCBridge" };

const FAQ = [
  ["How does an upgrade take effect?", "Pay through the secure Selar checkout, then enter your Selar order reference under Billing. We verify the order and activate the plan. Returning from checkout never changes a plan by itself."],
  ["What counts as an identity check?", "Each verification you submit counts once. AI reviews and watchlist screenings are tracked separately."],
  ["What happens when I reach a limit?", "New checks or AI reviews pause until the first day of the next month, or until you move to a higher plan."],
  ["Is each organization's data isolated?", "Yes. Row-level security scopes every record to your organization, and identity documents are stored in a private bucket."],
];

export default async function Pricing() {
  let signedIn = false;
  if (supabaseConfigured()) {
    const { data } = await (await createClient()).auth.getUser();
    signedIn = Boolean(data.user);
  }
  return (
    <>
      <section className="bg-bone pt-[100px]">
        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-10">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-4 max-w-3xl text-[36px] font-normal leading-[1.05] tracking-tight sm:text-[60px]">Pricing that scales with the decisions you automate</h1>
          <p className="mt-6 max-w-2xl text-[19px] text-ink/80">Every plan includes the full decision engine. Choose the volume of identity checks and AI case reviews your operation needs.</p>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1320px] gap-4 px-6 py-20 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => {
            const hot = p.id === "growth";
            const href = signedIn ? (p.url ? `/dashboard/billing?plan=${p.id}` : "/dashboard") : "/signup";
            return (
              <div key={p.id} className={`flex flex-col rounded-3xl p-8 ${hot ? "bg-plum text-white" : "bg-bone"}`}>
                <p className="eyebrow">{p.name}{hot && ": recommended"}</p>
                <p className="mt-6 text-[52px] leading-none tracking-tight">${p.price}<span className="text-base opacity-70"> /mo</span></p>
                <p className="mt-4 min-h-[72px] opacity-80">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3 text-[15px]">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-1 shrink-0" />{f}</li>)}
                </ul>
                <Link href={href} className={`btn mt-8 justify-center ${hot ? "btn-light" : "btn-dark"}`}>{signedIn ? "Log in" : "Sign up"}</Link>
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
              <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none justify-between text-lg">{q}<span className="transition group-open:rotate-45">+</span></summary><p className="mt-3 text-ink/75">{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
