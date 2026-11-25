export interface PageDef {
  section: "platform" | "use-cases" | "who-we-work-with" | "resources" | "about";
  slug: string;
  title: string;
  short: string;
  headline: string;
  lede: string;
  points: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  bullets: string[];
}

export const NAV = [
  { key: "platform", label: "Platform", intro: "KYCBridge combines an open data network, an orchestration engine and Applied AI into one platform that improves with every signal and every decision." },
  { key: "use-cases", label: "Use Cases", intro: "KYCBridge addresses identity risk across every stage of the customer lifecycle." },
  { key: "who-we-work-with", label: "Who We Work With", intro: "Built for institutions that move money, extend credit and open accounts." },
  { key: "resources", label: "Resources", intro: "Research, stories and tools from the KYCBridge team." },
  { key: "about", label: "About Us", intro: "The team and principles behind KYCBridge." },
] as const;

const P = (
  section: PageDef["section"], slug: string, title: string, short: string, headline: string, lede: string,
  points: [string, string][], stats: [string, string][], bullets: string[]
): PageDef => ({ section, slug, title, short, headline, lede, points: points.map(([title, body]) => ({ title, body })), stats: stats.map(([value, label]) => ({ value, label })), bullets });

export const PAGES: PageDef[] = [
  // ---- Platform
  P("platform", "applied-ai", "Applied AI suite", "Predictive and agentic AI to help your team spend time on what matters most.",
    "AI that works the queue, not just the dashboard", "Machine learning scores risk. Agentic AI reads the case, weighs the evidence and recommends a next step, with every action logged against your policy.",
    [["AI case reviewer", "Reads applicant data and risk signals, drafts a summary and recommends approve, request info, escalate or deny."], ["Attack radar", "Surfaces clusters of related applications so coordinated attacks are caught at the portfolio level."], ["Explainable by design", "Each recommendation cites the signals behind it and is stored with the case for audit."]],
    [["58%", "fewer manual reviews"], ["<5 min", "typical decision time"], ["100%", "AI actions logged"]],
    ["Structured, schema-validated model output", "Deterministic scoring kept separate from AI judgement", "Human stays the final decision maker", "Usage limits per plan"]),
  P("platform", "fraud-management", "Continuous fraud management", "Detect and prevent fraud across the entire customer lifecycle.",
    "Fraud defence that does not stop at onboarding", "Monitor identity, device and behavioural signals from first touch through every later interaction, and act the moment risk changes.",
    [["Signal monitoring", "Track email, phone, address, country and document signals on every check."], ["Ring detection", "Link applicants who share identifiers to expose fraud rings."], ["Adaptive thresholds", "Tune approve and deny cut-offs per workflow as fraud patterns shift."]],
    [["35%", "lower fraud losses"], ["5x", "savings per dollar spent"], ["24/7", "continuous monitoring"]],
    ["Lifecycle-wide risk scoring", "Configurable decision thresholds", "Automatic case creation for risky applicants", "Notifications for high-risk events"]),
  P("platform", "customer-onboarding", "Customer onboarding", "Accelerate onboarding with orchestrated identity verification.",
    "Onboard good customers in minutes", "Collect the right information, verify it against multiple checks and route only the uncertain applicants to a human.",
    [["Adaptive forms", "Ask for more only when risk demands it, so low-risk applicants move straight through."], ["Document capture", "Upload ID images to private, organisation-scoped storage."], ["Instant decisions", "Approve, review or deny automatically using your workflow thresholds."]],
    [["90%", "of openings automated"], ["56%", "higher auto-approval"], ["3x", "account opening growth"]],
    ["KYC for individuals", "KYB for businesses", "Private document storage", "Full decision audit trail"]),
  P("platform", "data-partners", "Data partner ecosystem", "Plug into a vendor-neutral data network.",
    "Best-in-class data, no lock-in", "Plug into the providers you trust, compare their performance and swap them without rebuilding your flows.",
    [["Vendor neutral", "Choose providers on performance, not on who sold you the platform."], ["Side-by-side testing", "Run champion and challenger checks on live traffic."], ["Fallback routing", "Fail over to a backup provider when one is slow or down."]],
    [["Open", "data network"], ["1", "integration to manage"], ["0", "vendor lock-in"]],
    ["Identity, device, email, phone, address", "Sanctions and PEP sources", "Document verification vendors", "Fraud consortium data"]),
  P("platform", "identity-verification", "Identity verification", "Verify customer identities with confidence across all touchpoints.",
    "Know who is on the other side", "Combine document, data and risk checks into one confident identity decision, for individuals and businesses alike.",
    [["Multi-signal checks", "Age, jurisdiction, email, phone, address and document signals are scored together."], ["Watchlist screening", "Fuzzy-match names against sanctions, PEP and internal lists."], ["Re-verification", "Re-run checks whenever customer data changes."]],
    [["KYC + KYB", "one platform"], ["88%", "faster application review"], ["2x", "customer conversions"]],
    ["Deterministic, explainable scoring", "Fuzzy name matching", "Channel-aware checks", "Exportable audit records"]),
  P("platform", "orchestration", "Orchestration & decisioning engine", "Route inputs, sequence vendor calls and manage dependencies.",
    "One engine to conduct every decision", "Define how checks run, in what order and what happens with the result. Change a workflow without a deploy.",
    [["Visual workflows", "Set approve and deny thresholds and auto-case rules from the dashboard."], ["Sequenced calls", "Run cheap checks first and expensive ones only when needed."], ["Versioned policy", "Every change is timestamped and attributable."]],
    [["<1s", "rule evaluation"], ["100%", "decisions traceable"], ["0", "code deploys to change policy"]],
    ["Threshold configuration", "Auto-case creation", "Per-organisation policy", "Reporting on decision mix"]),

  // ---- Use cases
  P("use-cases", "onboarding", "Onboarding", "Consumer, commercial, merchant and small business onboarding.",
    "Fast, frictionless onboarding that minimises risk", "Approve more good customers quickly, remove friction that does not reduce risk and verify identity across every acquisition channel.",
    [["Approve with confidence", "Automate the clear cases and focus analysts on the grey area."], ["Cut drop-off", "Only request extra information when the risk signals call for it."], ["Every channel", "Web, mobile, branch and API applications share one policy."]],
    [["90%", "automated openings"], ["3x", "digital account growth"], ["<5 min", "decision time"]],
    ["Consumer", "Commercial", "Merchant", "Small business"]),
  P("use-cases", "authentication", "Authentication & account servicing", "Risk-based authentication and step-up verification.",
    "Protect the account after it is open", "Apply risk-based authentication to logins, device changes and external account linking without punishing legitimate customers.",
    [["Step-up verification", "Trigger extra checks only when a request looks unusual."], ["Device and login risk", "Spot account takeover attempts early."], ["External account ownership", "Confirm a customer owns the accounts they link."]],
    [["70%", "less third-party ATO"], ["Low", "customer friction"], ["Real time", "risk decisions"]],
    ["Login and device management", "Risk-based authentication", "Step-up verification management", "External account ownership"]),
  P("use-cases", "transaction-monitoring", "Transaction monitoring", "Monitor P2P, ACH, wire, card and stablecoin activity.",
    "Spot suspicious movement of money", "Watch transactions across rails and raise cases for the patterns that matter.",
    [["Multi-rail coverage", "P2P, ACH, wire, RTP/FedNow, card and stablecoin."], ["Pattern alerts", "Velocity, structuring and unusual-counterparty alerts."], ["Case hand-off", "Alerts flow straight into case management."]],
    [["6", "payment rails"], ["Instant", "alerting"], ["1", "case queue"]],
    ["P2P", "ACH", "Wire", "RTP/FedNow", "Card", "Stablecoin"]),
  P("use-cases", "credit", "Credit", "Underwrite faster with identity and fraud confidence.",
    "Lend to real people, not synthetic ones", "Detect synthetic identities and first-party fraud before credit is extended.",
    [["Credit fraud checks", "Add identity and fraud signals to the underwriting decision."], ["Fewer manual reviews", "Automate decisions where the signals agree."], ["Portfolio visibility", "See attack patterns before losses compound."]],
    [["74%", "lower fraud losses"], ["58%", "fewer manual reviews"], ["88%", "faster review"]],
    ["Application fraud", "Synthetic identity detection", "Bust-out indicators", "Decision audit trail"]),
  P("use-cases", "compliance", "End-to-end compliance", "Perpetual KYC/KYB, AML screening and case management.",
    "Compliance that keeps pace with your growth", "Run KYC and KYB, screen against watchlists and manage the resulting cases in one place with a complete audit trail.",
    [["(Perpetual) KYC/KYB", "Verify at onboarding and keep verifying as customers change."], ["AML & watchlist screening", "Fuzzy-match against sanctions, PEP and internal lists."], ["Case management", "Assign, annotate, escalate and close with full history."]],
    [["100%", "decisions logged"], ["Fewer", "false positives"], ["1", "audit trail"]],
    ["(Perpetual) KYC/KYB", "AML & watchlist screening", "Case management", "Embedded finance", "SAR/CTR support"]),
  P("use-cases", "fraud-prevention", "Full-lifecycle fraud prevention", "ATO, identity, credit, money muling, ring attacks and scams.",
    "Stop fraud wherever it starts", "One platform for new account fraud, account takeover, money muling, fraud rings and scams.",
    [["ATO fraud", "Detect takeovers before money moves."], ["New account fraud", "Block synthetic and stolen identities at the door."], ["Scams and muling", "Identify accounts used to move scam proceeds."]],
    [["35%", "lower losses"], ["5x", "ROI"], ["Portfolio", "level visibility"]],
    ["ATO fraud", "Business fraud", "Credit fraud", "Fraud ring attacks", "Identity fraud", "Money muling", "New account fraud", "Scams"]),

  // ---- Who we work with
  P("who-we-work-with", "banks", "Banks", "Centralise risk management with enterprise controls.",
    "Consistent, enterprise-grade controls across every product", "Replace point solutions with one policy engine, one case queue and one audit trail.",
    [["One policy", "Apply the same rules across every line of business."], ["Audit ready", "Every decision is explainable and exportable."], ["Scales with volume", "Automate the routine, escalate the exceptions."]],
    [["27%", "fraud decrease YoY"], ["1", "unified platform"], ["Enterprise", "grade controls"]], ["Retail and commercial", "Cards and deposits", "Lending", "Treasury"]),
  P("who-we-work-with", "credit-unions", "Credit unions", "Member-first onboarding with strong fraud defence.",
    "Protect members without adding friction", "Approve legitimate members automatically and intervene only when real risk appears.",
    [["Member experience", "Fast approvals for good members."], ["Community scale", "Enterprise-level controls without an enterprise team."], ["Shared learning", "Benefit from patterns seen across the network."]],
    [["3x", "automation"], ["70%", "less ATO"], ["Fewer", "manual reviews"]], ["Membership onboarding", "Loan applications", "Digital banking", "Fraud monitoring"]),
  P("who-we-work-with", "fintechs", "Fintechs", "Launch compliant and scale without a compliance army.",
    "Go live in weeks, not quarters", "Start onboarding users and reducing risk quickly, then add controls as you grow.",
    [["Fast start", "Run verified onboarding within days."], ["Grow into controls", "Add screening, cases and workflows as you scale."], ["Developer friendly", "Simple API surface and clear responses."]],
    [["1 month", "to first users"], ["2x", "conversions"], ["5x", "fraud savings"]], ["Neobanks", "Lending platforms", "Payments", "Wallets"]),
  P("who-we-work-with", "sponsor-banks", "Sponsor banks", "Oversee partner programmes with confidence.",
    "Visibility into every programme you sponsor", "See the risk posture of each fintech partner and enforce consistent standards.",
    [["Programme oversight", "Compare decision mix across partners."], ["Shared standards", "Enforce minimum controls."], ["Evidence on demand", "Produce audit evidence quickly."]],
    [["All", "programmes visible"], ["1", "standard"], ["Fast", "audit response"]], ["Partner onboarding", "Programme monitoring", "Exam readiness"]),
  P("who-we-work-with", "crypto", "Crypto", "Screen customers and counterparties in a fast-moving market.",
    "Compliance for digital assets", "Verify identities, screen wallets' owners and monitor stablecoin flows.",
    [["Customer verification", "KYC and KYB for exchanges and custodians."], ["Stablecoin monitoring", "Watch on and off ramp activity."], ["Sanctions screening", "Screen against sanctions lists continuously."]],
    [["24/7", "markets, 24/7 controls"], ["Global", "jurisdiction coverage"], ["Fast", "decisions"]], ["Exchanges", "Custodians", "On/off ramps", "Wallet providers"]),
  P("who-we-work-with", "partners", "Data & channel partners", "Join the KYCBridge partner ecosystem.",
    "Grow with a network of best-in-class providers", "Bring your data or your customers to a platform institutions already rely on.",
    [["Data partners", "Reach institutions through one integration."], ["Channel partners", "Resell and implement with our team."], ["Co-innovation", "Build new signals together."]],
    [["Open", "partner network"], ["KYC + KYB", "one platform"], ["1", "integration"]], ["Become a data partner", "Become a channel partner"]),

  // ---- Resources
  P("resources", "content-library", "Content library", "Reports, guides and playbooks on fraud, identity and compliance.",
    "Practical knowledge for risk teams", "Download research and playbooks written by practitioners.",
    [["Reports", "Annual research on fraud trends."], ["Guides", "Step-by-step playbooks."], ["Webinars", "Recorded sessions with experts."]],
    [["50+", "assets"], ["Free", "to download"], ["Monthly", "updates"]], ["State of Fraud report", "KYC playbook", "AML checklist"]),
  P("resources", "client-stories", "Client stories", "How institutions use KYCBridge to grow and stay safe.",
    "Results from the teams on the platform", "Read how banks, credit unions and fintechs improved approval rates and cut losses.",
    [["Automation wins", "From manual queues to automated decisions."], ["Loss reduction", "Measurable drops in fraud losses."], ["Faster growth", "More accounts opened with less friction."]],
    [["74%", "lower losses"], ["88%", "faster review"], ["3x", "growth"]], ["Banks", "Credit unions", "Fintechs"]),
  P("resources", "blog", "Blog", "Expert insights from the KYCBridge team.",
    "Ideas on fraud, identity and compliance", "Opinion and analysis from people who work the queue every day.",
    [["Fraud and AI", "What AI really changes in fraud prevention."], ["Compliance", "Staying ahead of regulation."], ["Product", "What we shipped and why."]],
    [["Weekly", "posts"], ["Free", "subscription"], ["Open", "archive"]], ["Fraud", "Identity", "Compliance"]),
  P("resources", "events", "Events", "Meet the team at conferences and webinars.",
    "Where to find us", "Join live sessions and in-person events for risk and compliance leaders.",
    [["Webinars", "Live Q&A with product experts."], ["Conferences", "Booths and talks across the year."], ["Roundtables", "Small-group conversations."]],
    [["Quarterly", "summits"], ["Global", "events"], ["Free", "webinars"]], ["Upcoming events", "Past recordings"]),
  P("resources", "help-center", "Help Center", "Guides and answers for using KYCBridge.",
    "Get unstuck fast", "Find documentation on verifications, cases, screening, billing and settings.",
    [["Getting started", "Create an account and run your first check."], ["Workflows", "Configure thresholds and automation."], ["Billing", "Plans, limits and upgrades."]],
    [["24h", "support response"], ["Docs", "always current"], ["Email", "support"]], ["Getting started", "Billing", "Security"]),
  P("resources", "developers", "Developer hub", "API concepts, schemas and integration guides.",
    "Build on KYCBridge", "Understand the data model and how verification requests flow through the engine.",
    [["Verification API", "POST applicant data and receive a score, decision and signals."], ["Schemas", "Typed request and response shapes."], ["Webhooks", "Receive events when cases change."]],
    [["REST", "JSON"], ["Typed", "schemas"], ["Fast", "responses"]], ["Authentication", "Rate limits", "Error handling"]),

  // ---- About
  P("about", "company", "About us", "Why we built KYCBridge.",
    "Making identity risk manageable", "KYCBridge helps financial institutions say yes to good customers and no to bad actors.",
    [["Our mission", "Give every institution enterprise-grade risk tooling."], ["Our approach", "Open data, clear logic and accountable AI."], ["Our team", "Risk, product and engineering veterans."]],
    [["KYC + KYB", "one platform"], ["Open", "data network"], ["Global", "team"]], ["Mission", "Values", "Leadership"]),
  P("about", "careers", "Careers", "Join the team building the risk platform.",
    "Work on hard problems that matter", "We hire curious, careful people who care about customers and craft.",
    [["Engineering", "Build reliable, secure systems."], ["Risk & data science", "Model fraud and compliance risk."], ["Go to market", "Help institutions succeed."]],
    [["Remote", "friendly"], ["Open", "roles"], ["Growth", "stage"]], ["Benefits", "Culture", "Open roles"]),
  P("about", "security", "Security", "How we protect your data.",
    "Enterprise-grade security by default", "Data is isolated per organisation with row-level security, private storage and encrypted transport.",
    [["Tenant isolation", "Row-level security scopes every record to your organisation."], ["Private storage", "Identity documents live in private buckets."], ["Least privilege", "Secrets never reach the browser."]],
    [["RLS", "on every table"], ["TLS", "in transit"], ["Private", "document storage"]], ["Row-level security", "Private buckets", "Server-side secrets"]),
  P("about", "press", "Press", "News and media resources.",
    "KYCBridge in the news", "Find press releases, brand information and media contacts.",
    [["Press releases", "Company announcements."], ["Media kit", "Logos and boilerplate."], ["Contact", "Reach our communications team."]],
    [["Latest", "news"], ["Kit", "available"], ["Fast", "replies"]], ["Releases", "Media kit"]),
];

export const pagesIn = (section: string) => PAGES.filter((p) => p.section === section);
export const findPage = (section: string, slug: string) => PAGES.find((p) => p.section === section && p.slug === slug);
