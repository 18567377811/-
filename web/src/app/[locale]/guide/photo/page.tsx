import { getLocale, setRequestLocale } from "next-intl/server";
import { getLocalizedSiteContent } from "@/lib/site-config";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function PhotoGuidePage({ params }: Props) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const site = await getLocalizedSiteContent(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
      <h1 className="font-display text-4xl sm:text-5xl">
        {site.photoGuide.title}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{site.photoGuide.intro}</p>
      <ol className="mt-10 space-y-4">
        {site.photoGuide.tips.map((tip, index) => (
          <li
            key={`${tip}-${index}`}
            className="rounded-[1.25rem] border border-line bg-white/45 p-5"
          >
            <p className="text-xs tracking-[0.16em] text-moss uppercase">
              0{index + 1}
            </p>
            <p className="mt-2 text-base leading-relaxed">{tip}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
