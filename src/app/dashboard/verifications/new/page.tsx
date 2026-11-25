import { getContext } from "@/lib/context";
import { NewVerificationForm } from "@/components/NewVerificationForm";

export const metadata = { title: "New verification | KYCBridge" };

export default async function New() {
  const { org, plan, usage } = await getContext();
  const left = plan.checks - usage.check;
  return (
    <div>
      <h1 className="text-[32px] tracking-tight">New verification</h1>
      <p className="text-ink/60">{left > 0 ? `${left} checks remaining this month.` : "Monthly limit reached. Upgrade in Billing to continue."}</p>
      <NewVerificationForm orgId={org.id} />
    </div>
  );
}
