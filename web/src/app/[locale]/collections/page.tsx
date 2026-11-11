import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listActiveCategories } from "@/lib/catalog-queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function CollectionsIndexPage({ params }: Props) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const t = await getTranslations();
  const categories = await listActiveCategories(locale);

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20">
      <header className="max-w-2xl">
        <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
          {locale === "zh" ? "分类" : "Collections"}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink sm:text-5xl">
          {t("home.categoryTitle")}
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:mt-4 sm:text-base">
          {locale === "zh"
            ? "浏览全部作品分类，含未在首页展示的系列。"
            : "Browse every collection, including those not shown on the home page."}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] transition hover:shadow-[0_16px_40px_rgba(43,33,28,0.12)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-paper">
              <Image
                src={category.heroImage}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-1 px-4 py-4 sm:px-5">
              <h2 className="font-display text-xl text-ink">{category.name}</h2>
              <p className="line-clamp-2 text-sm text-ink-soft">
                {category.description}
              </p>
              {!category.showOnHome ? (
                <p className="pt-1 text-[11px] tracking-wide text-accent uppercase">
                  {locale === "zh" ? "更多分类" : "More"}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
