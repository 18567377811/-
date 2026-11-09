"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { collections, products } from "@/data/catalog";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";
import { formatUsd } from "@/lib/money";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/commerce";

function QuickAdd({ product }: { product: Product }) {
  const t = useTranslations();
  const addItem = useCartStore((state) => state.addItem);
  const [done, setDone] = useState(false);
  const variant = product.variants[0];

  return (
    <button
      type="button"
      className="btn-secondary btn-compact min-w-0 flex-1 basis-[46%] sm:flex-none"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!variant) return;
        addItem({
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
        });
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "✓" : t("products.addToCart")}
    </button>
  );
}

function BuyNow({ product }: { product: Product }) {
  const t = useTranslations();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const variant = product.variants[0];

  return (
    <button
      type="button"
      className="btn-primary btn-compact min-w-0 flex-1 basis-[46%] sm:flex-none"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!variant) return;
        addItem({
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
        });
        router.push("/cart");
      }}
    >
      {t("home.buyNow")}
    </button>
  );
}

function FeaturedCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const reverse = index % 2 === 1;
  const { ref, visible } = useRevealOnView<HTMLElement>();

  return (
    <article
      ref={ref}
      className={`overflow-hidden rounded-[1.75rem] bg-white shadow-[var(--shadow)] ring-1 ring-[color:var(--line)] transition hover:shadow-[0_16px_44px_rgba(43,33,28,0.12)] ${revealClass(visible, "cat-enter")}`}
      style={visible ? { animationDelay: `${index * 120}ms` } : undefined}
    >
      <div
        className={`grid lg:grid-cols-2 ${reverse ? "lg:[&>a:first-child]:order-2" : ""}`}
      >
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[4/5] block overflow-hidden bg-paper sm:aspect-[5/4] lg:aspect-auto lg:min-h-[420px]"
        >
          <Image
            src={product.image}
            alt={t(product.nameKey)}
            fill
            className="object-cover transition duration-700 hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Link>

        <div className="flex flex-col justify-center bg-white px-5 py-6 sm:px-8 sm:py-10">
          <Link
            href={`/products/${product.slug}`}
            className="flex flex-col gap-3 text-center lg:text-left"
          >
            <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
              {t(`collections.${product.collection}.name`)}
            </p>
            <h3 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              {t(product.nameKey)}
            </h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft lg:mx-0">
              {t(product.descriptionKey)}
            </p>
            <p className="font-display text-2xl text-accent">
              {t("products.from")} {formatUsd(product.priceFromUsd, locale)}
            </p>
            <p className="text-xs text-ink-soft">
              {t("products.turnaround")}: {product.turnaroundMonths}{" "}
              {t("products.months")}
            </p>
          </Link>

          <div className="mt-4 flex w-full flex-row items-center justify-center gap-2.5 lg:justify-start">
            <QuickAdd product={product} />
            <BuyNow product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}

function GridCard({ product, index }: { product: Product; index: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, visible } = useRevealOnView<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={`/products/${product.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(43,33,28,0.06)] ring-1 ring-[color:var(--line)] transition-[box-shadow] duration-300 hover:shadow-[0_14px_32px_rgba(43,33,28,0.14)] ${revealClass(visible, "list-card")}`}
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
          sizes="(max-width: 640px) 50vw, 280px"
        />
      </div>
      <div className="space-y-1 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
        <h3 className="line-clamp-2 font-display text-sm leading-snug text-ink sm:text-base">
          {t(product.nameKey)}
        </h3>
        <p className="text-xs text-ink-soft sm:text-sm">
          {t("products.from")} {formatUsd(product.priceFromUsd, locale)}
        </p>
        {product.rating ? (
          <p className="text-[11px] text-honey">{product.rating.toFixed(1)} ★</p>
        ) : null}
      </div>
    </Link>
  );
}

function displayModeOf(product: Product) {
  return (
    collections.find((item) => item.slug === product.collection)
      ?.displayMode ?? "grid"
  );
}

export function ProductShowcase() {
  const t = useTranslations();

  const { featured, grid } = useMemo(() => {
    const featuredList: Product[] = [];
    const gridList: Product[] = [];
    for (const product of products) {
      if (displayModeOf(product) === "featured") featuredList.push(product);
      else gridList.push(product);
    }
    return { featured: featuredList, grid: gridList };
  }, []);

  return (
    <section className="mt-8 px-4 sm:mt-12 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-6">
      <div className="mb-4 sm:mb-6">
        <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
          {t("home.productsEyebrow")}
        </p>
        <h2 className="font-display text-xl text-ink sm:text-2xl">
          {t("home.productsTitle")}
        </h2>
      </div>

      {featured.length > 0 ? (
        <div className="space-y-5 sm:space-y-8">
          {featured.map((product, index) => (
            <FeaturedCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      ) : null}

      {grid.length > 0 ? (
        <div
          className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${
            featured.length > 0 ? "mt-6 sm:mt-10" : ""
          }`}
        >
          {grid.map((product, index) => (
            <GridCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
