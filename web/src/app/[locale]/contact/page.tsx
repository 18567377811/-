import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
      <h1 className="font-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{t("body")}</p>
      <a href={`mailto:${t("email")}`} className="btn-primary mt-8">
        {t("cta")}
      </a>
      <p className="mt-4 text-sm text-ink-soft">{t("email")}</p>
    </div>
  );
}
