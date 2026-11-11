import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import { CommissionForm } from "@/components/commission/CommissionForm";
import { getProductBySlug } from "@/lib/catalog-queries";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function CommissionPage({ params }: Props) {
  const { locale: routeLocale, slug } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const product = await getProductBySlug(slug, locale);
  if (!product || product.saleType === "direct") notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
      <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
        Commission
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {locale === "zh"
          ? "定制委托申请"
          : locale === "ms"
            ? "Permohonan Komisen"
            : "Commission Request"}
      </h1>
      <p className="mt-3 text-sm text-ink-soft sm:text-base">
        {locale === "zh"
          ? "我们将在 1–2 个工作日内联系你，一起梳理想法。提交后不会立即扣款。"
          : locale === "ms"
            ? "Kami akan hubungi dalam 1–2 hari bekerja. Tiada caj segera selepas hantar."
            : "We’ll be in touch within 1–2 business days. Nothing is charged until you are comfortable with the plan."}
      </p>
      <p className="mt-4 text-sm font-medium text-ink">
        {product.name}
      </p>
      <div className="mt-8">
        <CommissionForm product={product} locale={locale} />
      </div>
    </div>
  );
}
