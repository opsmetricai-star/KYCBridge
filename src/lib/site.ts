export interface PageDef {
  section: "platform" | "use-cases" | "who-we-work-with" | "about";
  slug: string;
  title: string;
  short: string;
  headline: string;
  lede: string;
  points: { title: string; body: string }[];
  bullets: string[];
}

export const NAV = [
  { key: "platform", label: "Platform", intro: "One AI decision engine that analyzes identity risk, predicts fraud, decides outcomes and automates the review queue." },
  { key: "use-cases", label: "Use Cases", intro: "AI-driven risk decisions for every stage of the customer lifecycle, from first application to ongoing monitoring." },
  { key: "who-we-work-with", label: "Who We Work With", intro: "Built for regulated operators that open accounts, move money and extend credit at scale." },
  { key: "about", label: "Company", intro: "The principles and security model behind the KYCBridge decision engine." },
] as const;

const P = (
  section: PageDef["section"], slug: string, title: string, short: string, headline: string, lede: string,
  points: [string, string][], bullets: string[]
): PageDef => ({ section, slug, title, short, headline, lede, points: points.map(([title, body]) => ({ title, body })), bullets });

export const PAGES: PageDef[] = [
  // Platform
  P("platform", "applied-ai", "Applied AI", "AI that analyzes every case, recommends the decision and logs its reasoning.",
    "The AI engine that clears your review queue", "Risk scoring sets the facts. Applied AI reads each case, weighs the evidence, recommends approve, request information, escalate or deny, and records why. Analysts review decisions, not paperwork.",
    [["Case analysis", "The model reads applicant data and every triggered signal, then writes a plain-language summary an analyst can verify in seconds."], ["Decision recommendation", "Each case receives a ranked recommendation with a confidence score and the specific reasons behind it."], ["Governed by policy", "Scoring stays deterministic. AI output is schema-validated, stored with the case and counted against your plan, so every action is auditable."]],
    ["Schema-validated model output", "Raw ID numbers are never sent to the AI model", "Human sign-off on final decisions", "Per-plan AI usage limits"]),
  P("platform", "fraud-management", "Fraud management", "Predict and stop fraud from first touch through every later event.",
    "Fraud decisions made before losses occur", "Every application is scored against fifteen risk signals in a single request. High-risk applicants are denied or routed to a case automatically, so exposure is cut at the door.",
    [["Signal scoring", "Age, jurisdiction, email, phone, address and document signals combine into a transparent 0 to 100 risk score."], ["Automatic action", "Applicants above your deny threshold are declined and a high-priority case opens without manual triage."], ["Adaptive thresholds", "Move your approve and deny cut-offs as attack patterns change, with no code deployment."]],
    ["Fifteen weighted risk signals", "Disposable email and machine-pattern detection", "High-risk jurisdiction rules", "Instant notifications on high-risk denials"]),
  P("platform", "customer-onboarding", "Customer onboarding", "Automate approvals so good customers convert and risky ones stop at the door.",
    "Faster approvals, lower cost per account", "Collect only what the decision needs, verify it in one call and let the engine approve clean applicants instantly. Analyst time goes to the cases that carry real risk.",
    [["One-call verification", "Submit applicant data and receive a score, a decision and the signals behind it in a single response."], ["Document capture", "ID images are stored in a private bucket scoped to your organization and opened through short-lived links."], ["Straight-through approval", "Applicants below your approve threshold are cleared automatically, with a full audit record."]],
    ["KYC for individuals and KYB for businesses", "Private document storage", "Automatic case creation", "Complete decision history"]),
  P("platform", "watchlist-screening", "Watchlist screening", "Typo-tolerant name matching against the lists your compliance team owns.",
    "Screening that catches variants, not just exact matches", "Fuzzy matching resolves spelling variants, reordered names and diacritics. Every new verification is screened automatically, and ad hoc searches are logged.",
    [["Fuzzy matching", "Token-level edit distance scores each candidate so near matches surface and unrelated names do not."], ["Your lists, your control", "Maintain sanctions, PEP, adverse media and internal lists per organization."], ["Scored into the decision", "A watchlist hit raises the risk score and can move an applicant from approval to review or denial."]],
    ["Sanctions, PEP, adverse media and internal lists", "Automatic screening on every check", "Searchable screening history", "Match similarity shown as a percentage"]),
  P("platform", "identity-verification", "Identity verification", "Verify individuals and businesses across every channel with one policy.",
    "One identity decision across every channel", "Web, mobile, branch and API applications pass through the same engine and the same thresholds, so risk policy is enforced consistently.",
    [["Multi-signal checks", "Document, contact, location and age signals are scored together rather than in isolation."], ["Channel-aware records", "Each verification records its origin channel for later analysis."], ["Re-verification ready", "Run the check again whenever customer data changes and compare the outcome."]],
    ["Individual and business entity types", "Deterministic, explainable scoring", "Filterable verification history", "Per-record AI review"]),
  P("platform", "orchestration", "Decision workflows", "Set the thresholds that turn risk scores into automated outcomes.",
    "Your risk appetite, enforced automatically", "Define the score below which applicants are approved and the score at which they are denied. Everything between goes to review, with a case created for you.",
    [["Threshold control", "Two numbers define your automation boundary. Change them in seconds and apply them to every new check."], ["Auto-case rules", "Choose whether every review or denial opens a case for analyst follow-up."], ["Hard guardrails", "Applicants under 18 are always denied, regardless of any threshold."]],
    ["Per-organization policy", "Immediate effect on new verifications", "Case creation on review and deny", "Usage metered against your plan"]),

  // Use cases
  P("use-cases", "onboarding", "Onboarding", "Approve more qualified customers with fewer manual touches.",
    "Convert more good applicants, review fewer", "The engine scores each application on arrival and approves the clear cases instantly. Your team handles the exceptions, so cost per account falls as volume rises.",
    [["Instant decisions", "Clean applicants are approved in the same request that scored them."], ["Targeted friction", "Missing or weak data raises the score, so extra checks apply only where risk justifies them."], ["Every channel", "Web, mobile, branch and API share one policy."]],
    ["Consumer onboarding", "Commercial and small business onboarding", "Merchant onboarding", "Document upload and storage"]),
  P("use-cases", "fraud-prevention", "Fraud prevention", "Stop synthetic identities, disposable-email abuse and high-risk geographies early.",
    "Deny bad actors before they open an account", "New account fraud is decided at application time, using signals that expose throwaway emails, implausible data and restricted jurisdictions.",
    [["Application fraud", "Weighted signals expose fabricated and low-effort applications."], ["Jurisdiction risk", "High-risk and elevated-risk country rules adjust the score automatically."], ["Case follow-up", "Denials open high-priority cases with the evidence attached."]],
    ["New account fraud", "Identity fraud", "Throwaway email detection", "Document completeness checks"]),
  P("use-cases", "compliance", "Compliance", "KYC, KYB and AML screening with an audit trail behind every decision.",
    "Evidence your regulator will accept", "Each decision stores the applicant data, the triggered signals, the threshold in force and any AI analysis. Compliance teams answer audit questions from the record.",
    [["KYC and KYB", "Verify individuals and businesses under one policy."], ["AML screening", "Match names against your sanctions, PEP and internal lists."], ["Case management", "Assign, annotate, escalate and close with a timestamped history."]],
    ["Decision audit trail", "Watchlist screening log", "Case notes and status", "Private evidence storage"]),
  P("use-cases", "case-review", "Case review", "AI-prepared cases that analysts can close in minutes.",
    "Cut review time with AI-prepared cases", "Each case arrives with the evidence organized, a written summary and a recommended action. Analysts confirm or override instead of investigating from scratch.",
    [["Prepared evidence", "Signals, applicant details and documents sit on one screen."], ["Recommended action", "The AI proposes the next step and lists the reasons."], ["Clear ownership", "Status, priority and notes keep every case moving."]],
    ["Open, in review, escalated and closed states", "Priority levels", "Analyst notes", "Link to the originating verification"]),
  P("use-cases", "monitoring", "Risk monitoring", "Track decision mix, risk distribution and usage in real time.",
    "See risk movement the moment it happens", "The overview shows approval rate, average risk score, decision mix and open cases, so leaders can tune policy against what the portfolio is actually doing.",
    [["Decision mix", "Approved, review and denied outcomes for the current month."], ["Score distribution", "A histogram of risk scores shows where applicants cluster."], ["Capacity tracking", "Usage meters show checks and AI reviews against your plan."]],
    ["Auto-approval rate", "Average risk score", "Open case count", "Recent verification feed"]),

  // Who we work with
  P("who-we-work-with", "banks", "Banks", "Consistent, enterprise-grade risk decisions across every product line.",
    "One risk policy across the whole institution", "Replace fragmented checks with a single engine, a single case queue and a single audit record.",
    [["Policy consistency", "The same thresholds apply across channels and products."], ["Audit readiness", "Every decision is explainable and retrievable."], ["Analyst leverage", "AI preparation lets the same team cover more volume."]],
    ["Retail and commercial onboarding", "Lending applications", "Treasury and payments", "Compliance reporting"]),
  P("who-we-work-with", "credit-unions", "Credit unions", "Automate membership decisions without adding friction for genuine members.",
    "Approve members faster, review only real risk", "Clean membership applications clear instantly. Suspicious ones are scored, screened and queued with the evidence prepared.",
    [["Member conversion", "Straight-through approval removes waiting for low-risk applicants."], ["Lean teams", "AI case summaries let small compliance teams keep pace."], ["Defensible decisions", "Each outcome records the signals that produced it."]],
    ["Membership onboarding", "Loan applications", "Digital banking enrollment", "Watchlist screening"]),
  P("who-we-work-with", "fintechs", "Fintechs", "Go live with production-grade KYC and scale controls as you grow.",
    "Launch compliant, scale without a compliance backlog", "Start verifying customers through a single endpoint, then add screening, cases and tuned thresholds as volume grows.",
    [["Fast integration", "One verification request returns a score, a decision and the signals."], ["Elastic capacity", "Plans scale from hundreds to thousands of checks a month."], ["Automation first", "The engine decides, and your team handles exceptions."]],
    ["Neobanks and wallets", "Lending platforms", "Payments companies", "Marketplaces and platforms"]),
  P("who-we-work-with", "sponsor-banks", "Sponsor banks", "Hold every program to the same verification standard.",
    "Program oversight backed by a common standard", "Apply one set of thresholds and one audit format across the programs you sponsor.",
    [["Common standard", "Enforce minimum controls across partners."], ["Visible outcomes", "Compare decision mix and risk distribution."], ["Evidence on request", "Retrieve the record behind any decision."]],
    ["Partner program onboarding", "Threshold governance", "Audit evidence retrieval"]),
  P("who-we-work-with", "crypto", "Crypto and digital assets", "Verify counterparties and screen names in a market that never closes.",
    "Round-the-clock verification for round-the-clock markets", "Automated decisions run at any hour. Screening and scoring keep exposure bounded while your team sleeps.",
    [["Always-on decisions", "The engine does not wait for business hours."], ["Name screening", "Fuzzy matching against sanctions and internal lists."], ["Jurisdiction rules", "High-risk country signals feed every score."]],
    ["Exchanges and custodians", "On-ramp and off-ramp providers", "Wallet providers"]),

  // Company
  P("about", "company", "About KYCBridge", "Why we build AI-native risk infrastructure.",
    "Risk decisions should be made by machines and owned by people", "KYCBridge exists to remove manual work from identity risk while keeping humans accountable for the outcome. AI analyzes and recommends. Deterministic rules score. Your team decides.",
    [["Automation with accountability", "Every automated action is logged, explainable and reversible."], ["Deterministic where it matters", "Scoring is rule-based and reproducible. AI is used for analysis, never for the number."], ["Built for operators", "The product is designed around the queue your analysts actually work."]],
    ["AI-native decision engine", "Transparent scoring", "Operator-first workflows"]),
  P("about", "security", "Security", "Tenant isolation, private storage and server-side secrets by default.",
    "Security that is enforced in the database", "Row-level security scopes every record to your organization. Documents live in private storage. Secrets never reach the browser.",
    [["Tenant isolation", "Row-level security on every table restricts access to your organization."], ["Private storage", "Identity documents are stored privately and opened through links that expire in five minutes."], ["Billing integrity", "Only the billing system can change a plan. Clients cannot edit it."]],
    ["Row-level security on all tables", "Private document bucket", "Server-side API keys", "Encrypted transport"]),
];

export const pagesIn = (section: string) => PAGES.filter((p) => p.section === section);
export const findPage = (section: string, slug: string) => PAGES.find((p) => p.section === section && p.slug === slug);
