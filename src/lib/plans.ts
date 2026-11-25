export type PlanId = "free" | "starter" | "growth" | "scale";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  blurb: string;
  checks: number; // identity checks per month
  aiReviews: number; // AI reviews per month
  seats: number;
  features: string[];
  url: string | null;
}

export const PLANS: Plan[] = [
  {
    id: "free", name: "Sandbox", price: 0, blurb: "Explore the platform with limited volume.",
    checks: 10, aiReviews: 3, seats: 1, url: null,
    features: ["10 identity checks / month", "3 AI case reviews / month", "Rule-based risk scoring", "1 team seat"],
  },
  {
    id: "starter", name: "Starter", price: 47, blurb: "For early-stage fintechs onboarding their first customers.",
    checks: 200, aiReviews: 50, seats: 3,
    url: process.env.NEXT_PUBLIC_SELAR_STARTER_URL ?? "https://selar.com/47plan?currency=USD",
    features: ["200 identity checks / month", "50 AI case reviews / month", "Watchlist screening", "Case management", "3 team seats"],
  },
  {
    id: "growth", name: "Growth", price: 57, blurb: "For scaling teams that need automation and full-lifecycle controls.",
    checks: 1000, aiReviews: 300, seats: 10,
    url: process.env.NEXT_PUBLIC_SELAR_GROWTH_URL ?? "https://selar.com/57plan?currency=USD",
    features: ["1,000 identity checks / month", "300 AI case reviews / month", "Custom decision workflows", "Fraud signal analytics", "10 team seats"],
  },
  {
    id: "scale", name: "Scale", price: 97, blurb: "For regulated institutions running KYC and KYB at volume.",
    checks: 5000, aiReviews: 1500, seats: 50,
    url: process.env.NEXT_PUBLIC_SELAR_SCALE_URL ?? "https://selar.com/97plan?currency=USD",
    features: ["5,000 identity checks / month", "1,500 AI case reviews / month", "KYB business verification", "Priority support", "50 team seats"],
  },
];

export const planById = (id: string | null | undefined) =>
  PLANS.find((p) => p.id === id) ?? PLANS[0];
