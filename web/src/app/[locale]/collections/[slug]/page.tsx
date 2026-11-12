import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/product/ProductCard";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
  listActiveCategories,
} from "@/lib/catalog-queries";
import { stripHtml } from "@/lib/html-text";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const categories = await listActiveCategories(routing.defaultLocale);
    return routing.locales.flatMap((locale) =>
      categories.map((collection) => ({
        locale,
        slug: collection.slug,
      })),
    );
  } catch {
    return [];
  }
}

export default async function CollectionPage({ params }: Props) {
  const { locale: routeLocale, slug } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();

  const collection = await getCategoryBySlug(slug, locale);
  if (!collection) notFound();

  const t = await getTranslations();
  const items = await getProductsByCategorySlug(slug, locale);

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20">
      <header className="max-w-2xl">
        <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
          {locale === "zh" ? "分类" : "Collection"}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink sm:text-5xl">
          {collection.name}
        </h1>
        {stripHtml(collection.description) ? (
          <p className="mt-2 text-sm text-ink-soft sm:mt-4 sm:text-base">
            {stripHtml(collection.description)}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-ink-soft sm:text-sm">
          {items.length} {locale === "zh" ? "件商品" : "products"}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">{t("search.empty")}</p>
      ) : null}
    </div>
  );
}
