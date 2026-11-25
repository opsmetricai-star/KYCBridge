import Link from "next/link";
import { NAV, pagesIn } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {NAV.map((n) => (
            <div key={n.key}>
              <p className="eyebrow mb-5 text-white/50">{n.label}</p>
              <ul className="space-y-3 text-[15px]">
                {pagesIn(n.key).map((p) => (
                  <li key={p.slug}><Link className="hover:text-coral" href={`/${p.section}/${p.slug}`}>{p.title}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow mb-5 text-white/50">Get started</p>
            <ul className="space-y-3 text-[15px]">
              <li><Link className="hover:text-coral" href="/pricing">Pricing</Link></li>
              <li><Link className="hover:text-coral" href="/signup">Sign up</Link></li>
              <li><Link className="hover:text-coral" href="/login">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
          <Logo className="text-white" />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/60">
            <span>© {new Date().getFullYear()} KYCBridge</span>
            <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
