import { getLocale, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocalizedSiteContent } from "@/lib/site-config";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function CommissionThanksPage({ params }: Props) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const { thanks } = await getLocalizedSiteContent(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 pb-20 text-center sm:px-6 sm:pt-16">
      <p className="text-[10px] tracking-[0.2em] text-accent uppercase">
        Forever Home
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
        {thanks.title}
      </h1>
      <p className="mt-2 font-display text-lg leading-snug text-ink-soft sm:text-2xl">
        {thanks.titleAlt}
      </p>
      <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
        {thanks.body}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
        {thanks.bodyAlt}
      </p>

      <div className="mt-12">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          {thanks.next}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{thanks.nextAlt}</p>
      </div>

      <ol className="mt-6 space-y-3 text-left">
        {thanks.steps.map((step, index) => (
          <li
            key={`${index}-${step.primary}`}
            className="rounded-2xl bg-white px-4 py-4 shadow-[var(--shadow)] ring-1 ring-[color:var(--line)]"
          >
            <p className="text-sm leading-relaxed text-ink">
              <span className="font-semibold text-accent">{index + 1}.</span>{" "}
              {step.primary}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              {step.secondary}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-ink-soft">{thanks.note}</p>
      <p className="mt-1 text-xs text-ink-soft/80">{thanks.noteAlt}</p>

      <Link href="/collections" className="btn-primary mt-8 inline-flex">
        {thanks.cta}
      </Link>
    </div>
  );
}
