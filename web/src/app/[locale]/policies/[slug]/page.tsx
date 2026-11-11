import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getLocalizedSiteContent } from "@/lib/site-config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

const TITLES: Record<string, { zh: string; en: string; ms: string }> = {
  refund: { zh: "退款政策", en: "Refund Policy", ms: "Dasar Bayaran Balik" },
  shipping: { zh: "物流政策", en: "Shipping Policy", ms: "Dasar Penghantaran" },
  terms: { zh: "服务条款", en: "Terms of Service", ms: "Terma Perkhidmatan" },
  care: { zh: "护理说明", en: "Care Instruction", ms: "Arahan Penjagaan" },
};

export default async function PolicyPage({ params }: Props) {
  const { locale: routeLocale, slug } = await params;
  setRequestLocale(routeLocale);
  if (!TITLES[slug]) notFound();

  const locale = await getLocale();
  const site = await getLocalizedSiteContent(locale);
  const html =
    slug === "refund"
      ? site.policies.refund
      : slug === "shipping"
        ? site.policies.shipping
        : slug === "terms"
          ? site.policies.terms
          : site.policies.care;

  const title =
    locale === "zh"
      ? TITLES[slug].zh
      : locale === "ms"
        ? TITLES[slug].ms
        : TITLES[slug].en;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">{title}</h1>
      <div
        className="prose prose-neutral mt-8 max-w-none text-ink-soft [&_img]:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: html || "<p>—</p>" }}
      />
    </div>
  );
}
