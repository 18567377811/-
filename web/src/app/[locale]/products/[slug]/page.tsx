import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { getProductBySlug, listProducts } from "@/lib/catalog-queries";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const products = await listProducts(routing.defaultLocale);
    return routing.locales.flatMap((locale) =>
      products.map((product) => ({
        locale,
        slug: product.slug,
      })),
    );
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale: routeLocale, slug } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();

  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = await getTranslations();

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-3 pt-10 pb-16 sm:gap-10 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-muted shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] sm:rounded-[2rem]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col justify-center">
        <Link
          href={`/collections/${product.categorySlug}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          {product.categoryName}
        </Link>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          {product.summary}
        </p>
        <div
          className="prose prose-neutral mt-4 max-w-none text-sm leading-relaxed text-ink-soft [&_img]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
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
