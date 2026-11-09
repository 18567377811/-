import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { getProduct, products } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      slug: product.slug,
    })),
  );
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations();

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-3 pt-4 pb-16 sm:gap-10 sm:px-6 sm:pt-6 sm:pb-20 lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-muted shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] sm:rounded-[2rem]">
        <Image
          src={product.image}
          alt={t(product.nameKey)}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col justify-center">
        <Link
          href={`/collections/${product.collection}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          {t(`collections.${product.collection}.name`)}
        </Link>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
          {t(product.nameKey)}
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          {t(product.summaryKey)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {t(product.descriptionKey)}
        </p>
        <p className="mt-6 text-sm">
          <span className="text-ink-soft">{t("products.turnaround")}: </span>
          <span className="font-semibold text-ink">
            {product.turnaroundMonths} {t("products.months")}
          </span>
        </p>

        <div className="mt-8 rounded-[1.5rem] bg-white p-5 shadow-[var(--shadow)] ring-1 ring-[color:var(--line)]">
          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  );
}
