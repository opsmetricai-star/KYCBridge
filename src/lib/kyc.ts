import { z } from "zod";

/** Input validation for an identity verification request. */
export const verificationInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  country: z.string().trim().length(2, "Use a 2-letter ISO country code").transform((s) => s.toUpperCase()),
  address: z.string().trim().max(250).optional().default(""),
  phone: z.string().trim().max(30).optional().default(""),
  id_type: z.enum(["passport", "national_id", "drivers_license", "none"]),
  id_number: z.string().trim().max(40).optional().default(""),
  entity_type: z.enum(["individual", "business"]).default("individual"),
  channel: z.enum(["web", "mobile", "branch", "api"]).default("web"),
  document_path: z.string().max(300).optional().nullable(),
});
export type VerificationInput = z.infer<typeof verificationInput>;

export interface Signal { code: string; label: string; weight: number; detail: string }
export interface Scored { score: number; decision: "approve" | "review" | "deny"; signals: Signal[] }

const HIGH_RISK = new Set(["KP", "IR", "SY", "MM", "AF", "YE", "CU"]);
const ELEVATED = new Set(["RU", "VE", "LY", "SD", "SO", "HT", "ML", "SS"]);
const DISPOSABLE = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "yopmail.com", "trashmail.com"];

export function ageOf(dob: string, now = new Date()): number {
  const d = new Date(dob + "T00:00:00Z");
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

/** Deterministic risk scoring (0 = safe, 100 = highest risk). No AI involved. */
export function scoreVerification(i: VerificationInput, watchlistHits = 0, now = new Date()): Scored {
  const signals: Signal[] = [];
  const add = (code: string, label: string, weight: number, detail: string) =>
    signals.push({ code, label, weight, detail });

  const dob = new Date(i.date_of_birth + "T00:00:00Z");
  if (Number.isNaN(dob.getTime()) || dob > now) {
    add("dob_invalid", "Invalid date of birth", 40, "Date of birth is not a real past date.");
  } else {
    const age = ageOf(i.date_of_birth, now);
    if (age < 18) add("underage", "Applicant under 18", 45, `Calculated age is ${age}.`);
    else if (age > 100) add("age_implausible", "Implausible age", 25, `Calculated age is ${age}.`);
  }

  const domain = i.email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE.includes(domain)) add("email_disposable", "Disposable email", 20, `${domain} is a throwaway mail provider.`);
  if (/\d{6,}/.test(i.email.split("@")[0])) add("email_pattern", "Machine-like email", 8, "Local part contains a long digit run.");

  if (HIGH_RISK.has(i.country)) add("country_high", "High-risk jurisdiction", 35, `${i.country} is on the high-risk list.`);
  else if (ELEVATED.has(i.country)) add("country_elevated", "Elevated-risk jurisdiction", 15, `${i.country} is on the elevated-risk list.`);

  if (i.id_type === "none" || !i.id_number) add("no_id", "No ID document", 25, "No identity document number supplied.");
  else {
    if (i.id_number.length < 6) add("id_short", "ID number too short", 15, "Document number is shorter than 6 characters.");
    if (/^(.)\1+$/.test(i.id_number)) add("id_repeat", "Repeating ID number", 25, "Document number is one repeated character.");
    if (!i.document_path) add("no_doc_image", "No document image", 10, "No scan of the document was uploaded.");
  }

  if (!i.address) add("no_address", "Missing address", 8, "No residential address supplied.");
  if (!i.phone) add("no_phone", "Missing phone", 4, "No phone number supplied.");
  else if (!/^\+?[0-9 ()-]{7,20}$/.test(i.phone)) add("phone_format", "Malformed phone", 8, "Phone format is not recognised.");

  if (watchlistHits > 0) add("watchlist", "Watchlist match", Math.min(60, 40 + watchlistHits * 10), `${watchlistHits} watchlist record(s) matched.`);

  const score = Math.min(100, signals.reduce((s, x) => s + x.weight, 0));
  const decision = signals.some((s) => s.code === "underage") || score >= 70 ? "deny" : score >= 30 ? "review" : "approve";
  return { score, decision, signals };
}

/** Normalised fuzzy name similarity 0..1 (token Jaccard blended with containment). */
export function nameSimilarity(a: string, b: string): number {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  const [small, large] = A.size <= B.size ? [[...A], [...B]] : [[...B], [...A]];
  // Each token of the shorter name is matched to its closest token in the longer one (typo tolerant).
  const total = small.reduce((s, t) => s + Math.max(...large.map((u) => tokenRatio(t, u))), 0);
  const base = total / small.length;
  const coverage = small.length / large.length; // penalise extra unmatched tokens mildly
  return base * (0.85 + 0.15 * coverage);
}

function tokenRatio(a: string, b: string): number {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}
