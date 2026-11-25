# KYCBridge

Full-lifecycle identity and fraud intelligence: a public marketing site plus a working KYC/KYB application built with Next.js, TypeScript, Tailwind CSS, Supabase and Gemini.

## What is implemented

**Public site** (`src/app/(site)`): homepage (hero, signal marquee, stats, unified-risk tabs, platform cards, data partners, Applied AI, audience tabs, results, resources, newsletter), mega-menu navigation, 28 section pages (platform, use cases, who we work with, resources, about), pricing with FAQ, demo request form, legal pages, footer.

**Auth**: sign-up, login, logout, password recovery and reset, protected routes via `src/proxy.ts`, per-organisation access.

**Application** (`/dashboard`): overview analytics, identity verification (KYC/KYB) with document upload to private storage, deterministic risk scoring, watchlist screening with typo-tolerant fuzzy matching, case management, configurable decision thresholds, notifications, billing and usage meters, settings.

**AI**: `/api/ai-review` sends the risk signals (not the raw ID number) to Gemini with a response schema, validates the result with zod, stores it, and counts it against the plan's monthly AI allowance. Risk scores are calculated deterministically in `src/lib/kyc.ts`; the AI only recommends.

**Payments**: the three Selar links are used from `src/lib/plans.ts` / env. Selar redirects are never trusted. A customer submits their Selar order reference, and an admin listed in `ADMIN_EMAILS` confirms the order in Selar and approves it at `/admin`. Only the service role can change an organisation's plan (database trigger).

## Setup

1. `npm install`
2. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor. It creates tables, RLS policies, the signup trigger and the private `documents` bucket.
3. Copy `.env.example` to `.env.local` and fill in the values (see below).
4. `npm run dev`

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Needed for `/admin` approvals |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Server only |
| `ADMIN_EMAILS` | Comma-separated emails allowed to approve payments |
| `NEXT_PUBLIC_SELAR_*_URL` | Selar payment links |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL |

In Supabase Auth settings, add your site URL and `/reset-password` and `/dashboard` to the redirect allow-list.

## Deploying to Vercel

Import the repository, add the environment variables above, deploy. Never commit `.env.local`.

## Known limitations

- Supabase credentials were not supplied, so auth, database, storage and the dashboard have **not been exercised against a live project**. Type-checking and production build pass; the scoring and matching logic was unit-checked locally.
- Third-party data vendors, biometric document verification and real sanctions/PEP feeds are not integrated. Screening runs against lists you add yourself.
- Payment confirmation is manual (admin approval) because no Selar webhook secret or API was provided.
- Customer quotes and outcome figures on the marketing pages are labelled sample/target content and must be replaced with real, approved material.
- The reference font is proprietary, so Hanken Grotesk is used. The head illustration and icons are original SVG.
