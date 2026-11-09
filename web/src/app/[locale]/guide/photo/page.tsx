import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PhotoGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");

  const tips = ["light", "front", "side", "color", "story"] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
      <h1 className="font-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-lg text-ink-soft">{t("intro")}</p>
      <ol className="mt-10 space-y-4">
        {tips.map((tip, index) => (
          <li
            key={tip}
            className="rounded-[1.25rem] border border-line bg-white/45 p-5"
          >
            <p className="text-xs tracking-[0.16em] text-moss uppercase">
              0{index + 1}
            </p>
            <p className="mt-2 text-base leading-relaxed">{t(`tips.${tip}`)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
