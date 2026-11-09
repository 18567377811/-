import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatUsd } from "@/lib/money";
import type { Product } from "@/types/commerce";

export async function ProductCard({ product }: { product: Product }) {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(43,33,28,0.06)] ring-1 ring-[color:var(--line)] transition-[box-shadow] duration-300 hover:shadow-[0_14px_32px_rgba(43,33,28,0.14)]"
    >
      <div className="relative aspect-square overflow-hidden bg-paper">
        <Image
          src={product.image}
          alt={t(product.nameKey)}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="space-y-1 px-3 py-3 text-center sm:px-4 sm:py-4">
        <h3 className="line-clamp-2 font-display text-sm leading-snug text-ink sm:text-base">
          {t(product.nameKey)}
        </h3>
        <p className="text-xs text-ink-soft sm:text-sm">
          {t("products.from")} {formatUsd(product.priceFromUsd, locale)}
        </p>
      </div>
    </Link>
  );
}
