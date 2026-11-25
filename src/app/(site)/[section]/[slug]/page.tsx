import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PAGES, findPage, pagesIn, NAV } from "@/lib/site";

export function generateStaticParams() {
  return PAGES.map((p) => ({ section: p.section, slug: p.slug }));
}

export default async function SitePage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const page = findPage(section, slug);
  if (!page) notFound();
  const sectionLabel = NAV.find((n) => n.key === page.section)?.label;
  const related = pagesIn(page.section).filter((p) => p.slug !== page.slug).slice(0, 3);
  const colors = ["bg-blush", "bg-coral", "bg-plum text-white"];

  return (
    <>
      <section className="bg-bone pt-[100px]">
        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-10">
          <p className="eyebrow flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-ink/70" />{sectionLabel}: {page.title}</p>
          <h1 className="mt-6 max-w-4xl text-[36px] font-normal leading-[1.05] tracking-tight sm:text-[60px]">{page.headline}</h1>
          <p className="mt-8 max-w-2xl text-[19px] leading-relaxed text-ink/80">{page.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-dark">Sign up</Link>
            <Link href="/login" className="btn btn-coral">Log in</Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1320px] gap-4 px-6 py-20 sm:px-10 lg:grid-cols-3">
          {page.points.map((p, i) => (
            <div key={p.title} className={`flex min-h-[320px] flex-col justify-between rounded-3xl p-8 ${colors[i % 3]}`}>
              <span className="text-xs">0{i + 1}</span>
              <div><h3 className="text-[26px] leading-tight">{p.title}</h3><p className="mt-4 text-[16px] leading-relaxed opacity-85">{p.body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2">
          <h2 className="text-[32px] leading-tight sm:text-[44px]">Capabilities</h2>
          <ul className="space-y-3">
            {page.bullets.map((b) => <li key={b} className="flex items-center gap-4 rounded-2xl bg-paper px-6 py-4 text-[17px]"><span className="h-2 w-2 shrink-0 rounded-full bg-coral" />{b}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-10">
          <h2 className="text-[30px]">Related</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/${p.section}/${p.slug}`} className="flex flex-col justify-between rounded-3xl bg-bone p-7 transition hover:bg-[#e2e2db]">
                <div><p className="text-xl">{p.title}</p><p className="mt-2 text-ink/65">{p.short}</p></div>
                <ChevronRight className="mt-6" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-coral">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 px-6 py-16 sm:px-10">
          <h2 className="max-w-2xl text-[30px] leading-tight sm:text-[44px]">Run the engine on your own applicants</h2>
          <Link href="/signup" className="btn btn-dark">Create account</Link>
        </div>
      </section>
    </>
  );
}
