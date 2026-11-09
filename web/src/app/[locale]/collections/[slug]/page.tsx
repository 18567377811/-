import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/product/ProductCard";
import {
  collections,
  getCollection,
  getProductsByCollection,
} from "@/data/catalog";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    collections.map((collection) => ({
      locale,
      slug: collection.slug,
    })),
  );
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const collection = getCollection(slug);
  if (!collection) notFound();

  const t = await getTranslations();
  const items = getProductsByCollection(slug);

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20">
      <header className="max-w-2xl">
        <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
          {locale === "zh" ? "分类" : "Collection"}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink sm:text-5xl">
          {t(collection.nameKey)}
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:mt-4 sm:text-base">
          {t(collection.descriptionKey)}
        </p>
        <p className="mt-2 text-xs text-ink-soft sm:text-sm">
          {items.length} {locale === "zh" ? "件商品" : "products"}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
