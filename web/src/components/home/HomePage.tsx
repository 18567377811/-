import { getLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { getHomePayload } from "@/lib/catalog-queries";
import { getLocalizedSiteContent } from "@/lib/site-config";

export async function HomePage() {
  const locale = await getLocale();
  const [{ slides, custom, direct }, site] = await Promise.all([
    getHomePayload(locale),
    getLocalizedSiteContent(locale),
  ]);

  return (
    <div className="pb-16 sm:pb-20">
      <HeroCarousel slides={slides} />
      <ProductShowcase sections={[custom, direct]} />

      <section className="mx-auto mt-12 w-full max-w-[1200px] px-[4%] sm:mt-16 sm:px-6">
        <h2 className="font-display text-[clamp(1.35rem,1.1rem+1.2vw,1.875rem)] text-ink">
          {site.process.title}
        </h2>
        <p className="mt-2 max-w-2xl text-[clamp(0.8125rem,0.75rem+0.35vw,1rem)] text-ink-soft">
          {site.process.body}
        </p>
        <ol className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          {site.process.steps.map((step, index) => (
            <li
              key={`${step.title}-${index}`}
              className="rounded-2xl bg-white p-4 shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] sm:p-5"
            >
              <p className="text-[10px] tracking-[0.16em] text-accent uppercase">
                0{index + 1}
              </p>
              <h3 className="mt-1 font-display text-lg text-ink sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-12 w-full max-w-[1200px] px-[4%] sm:mt-16 sm:px-6">
        <h2 className="font-display text-[clamp(1.35rem,1.1rem+1.2vw,1.875rem)] text-ink">
          {locale === "zh" ? "常见问题" : "FAQ"}
        </h2>
        <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-white shadow-[var(--shadow)] ring-1 ring-[color:var(--line)]">
          {site.faq.map((item) => (
            <details key={item.q} className="group px-4 py-3.5 sm:px-5 sm:py-4">
              <summary className="cursor-pointer list-none text-sm font-medium marker:content-none sm:text-base">
                {item.q}
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
