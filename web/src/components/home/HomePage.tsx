import { getTranslations } from "next-intl/server";
import { CategoryRail } from "@/components/home/CategoryRail";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";

export async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="pb-16 sm:pb-20">
      <HeroCarousel />
      <CategoryRail />
      <ProductShowcase />

      <section className="mt-12 px-4 sm:mt-16 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-6">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          {t("home.processTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft sm:text-base">
          {t("home.processBody")}
        </p>
        <ol className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          {(["photo", "structure", "details", "preview"] as const).map(
            (step, index) => (
              <li
                key={step}
                className="rounded-2xl bg-white p-4 shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] sm:p-5"
              >
                <p className="text-[10px] tracking-[0.16em] text-accent uppercase">
                  0{index + 1}
                </p>
                <h3 className="mt-1 font-display text-lg text-ink sm:text-xl">
                  {t(`process.${step}.title`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {t(`process.${step}.body`)}
                </p>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="mt-12 px-4 sm:mt-16 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-6">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          {t("home.faqTitle")}
        </h2>
        <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-white shadow-[var(--shadow)] ring-1 ring-[color:var(--line)]">
          {(["ship", "time", "made", "happy"] as const).map((item) => (
            <details key={item} className="group px-4 py-3.5 sm:px-5 sm:py-4">
              <summary className="cursor-pointer list-none text-sm font-medium marker:content-none sm:text-base">
                {t(`faq.${item}.q`)}
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {t(`faq.${item}.a`)}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
