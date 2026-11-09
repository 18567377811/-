"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarIcon } from "@/components/layout/HeaderIcons";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";
import { formatUsd } from "@/lib/money";
import type { Product } from "@/types/commerce";

type Props = {
  product: Product;
  index: number;
  animKey: string;
};

export function SearchProductCard({ product, index, animKey }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, visible } = useRevealOnView<HTMLAnchorElement>({
    // Re-run when filter results remount via key on parent grid
    threshold: 0.12,
  });

  return (
    <Link
      ref={ref}
      key={`${animKey}-${product.id}`}
      href={`/products/${product.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(43,33,28,0.06)] ring-1 ring-[color:var(--line)] transition-[box-shadow,opacity,transform] duration-300 hover:shadow-[0_14px_32px_rgba(43,33,28,0.14)] ${revealClass(visible, "list-card")}`}
      style={
        visible
          ? { animationDelay: `${Math.min(index, 12) * 45}ms` }
          : undefined
      }
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
      <div className="space-y-1 px-3 py-3 text-left sm:px-4 sm:py-4">
        <h3 className="line-clamp-2 font-display text-sm leading-snug text-ink sm:text-base">
          {t(product.nameKey)}
        </h3>
        <p className="text-xs text-ink-soft sm:text-sm">
          {t("products.from")} {formatUsd(product.priceFromUsd, locale)}
        </p>
        {typeof product.rating === "number" ? (
          <p className="flex items-center gap-1 text-xs text-ink-soft">
            <span>{product.rating.toFixed(1)}</span>
            <StarIcon className="h-3.5 w-3.5 text-honey" />
          </p>
        ) : null}
      </div>
    </Link>
  );
}
