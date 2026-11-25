import { notFound } from "next/navigation";

const DOCS: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy Policy", body: [
    "KYCBridge processes personal data that you submit for identity verification on your behalf. You remain the controller of that data.",
    "We store account, usage and verification records in a managed Postgres database with row-level security, and identity documents in private storage scoped to your organization.",
    "We use a third-party AI provider to generate case review summaries. Only the fields needed for the review are sent.",
    "Organization owners control the records stored in their workspace, and access is restricted to members of that organization." ] },
  terms: { title: "Terms of Service", body: [
    "By using KYCBridge you agree to use the service lawfully and only to verify individuals and businesses you have a legitimate basis to assess.",
    "Risk scores and AI summaries are decision support. You are responsible for final onboarding and compliance decisions.",
    "Paid plans are activated after payment is verified. Usage allowances reset monthly."
  ] },
};

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();
  return (
    <section className="bg-paper pt-[100px]">
      <div className="mx-auto max-w-[800px] px-6 py-20">
        <h1 className="text-[44px] tracking-tight">{d.title}</h1>
        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink/80">{d.body.map((p) => <p key={p}>{p}</p>)}</div>
      </div>
    </section>
  );
}
