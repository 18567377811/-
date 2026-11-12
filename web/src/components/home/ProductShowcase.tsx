"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ContactUsButton } from "@/components/layout/social";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";
import { startStripeCheckout } from "@/lib/checkout-client";
import { cardPlainText } from "@/lib/html-text";
import { useRegion } from "@/components/layout/RegionProvider";
import { useCartStore } from "@/store/cart";
import type { HomeSaleSection, Product } from "@/types/commerce";

function FeaturedActions({ product }: { product: Product }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const variant = product.variants[0];
  const isCustom = product.saleType !== "direct";

  const btnSecondary =
    "btn-secondary btn-compact inline-flex min-w-0 flex-1 items-center justify-center sm:flex-none";
  const btnPrimary =
    "btn-primary btn-compact inline-flex min-w-0 flex-1 items-center justify-center sm:flex-none";

  if (isCustom) {
    return (
      <>
        <ContactUsButton
          className={btnSecondary}
          label={t("home.contactUs")}
        />
        <button
          type="button"
          className={btnPrimary}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            router.push(`/commission/${product.slug}`);
          }}
        >
          {t("home.customizeNow")}
        </button>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={btnSecondary}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!variant) return;
          addItem({
            productId: product.id,
            variantId: variant.id,
            quantity: 1,
          });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
      >
        {added ? "✓" : t("products.addToCart")}
      </button>
      <button
        type="button"
        className={btnPrimary}
        disabled={buying || !variant}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!variant || buying) return;
          setBuyError(null);
          setBuying(true);
          void startStripeCheckout({
            items: [
              {
                productId: product.id,
                variantId: variant.id,
                quantity: 1,
              },
            ],
            locale,
            cancelPath: `/products/${product.slug}`,
          }).catch((err) => {
            setBuying(false);
            setBuyError(
              err instanceof Error ? err.message : t("cart.checkoutError"),
            );
          });
        }}
      >
        {buying ? t("products.buying") : t("home.buyNow")}
      </button>
      {buyError ? (
        <p
          className="basis-full text-center text-xs text-clay lg:text-left"
          role="alert"
        >
          {buyError}
        </p>
      ) : null}
    </>
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
  const { formatPrice } = useRegion();
  const reverse = index % 2 === 1;
  const { ref, visible } = useRevealOnView<HTMLElement>();
  const blurb = cardPlainText(product.summary, product.description);

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
            alt={product.name}
            fill
            className="object-cover transition duration-700 hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Link>

        <div className="flex flex-col justify-center bg-white px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
          <Link
            href={`/products/${product.slug}`}
            className="flex flex-col gap-3.5 text-center lg:text-left"
          >
            <p className="text-[11px] tracking-[0.18em] text-accent uppercase sm:text-xs">
              {product.categoryName}
            </p>
            <h3 className="font-display text-[clamp(1.35rem,1rem+2vw,2.25rem)] leading-snug text-balance text-ink">
              {product.name}
            </h3>
            {blurb ? (
              <p className="mx-auto max-w-md line-clamp-4 text-[clamp(0.875rem,0.8rem+0.4vw,1rem)] leading-relaxed text-ink-soft lg:mx-0">
                {blurb}
              </p>
            ) : null}
            <p className="font-display text-[clamp(1.35rem,1rem+2vw,1.875rem)] text-accent">
              {t("products.from")} {formatPrice(product.priceFromUsd)}
            </p>
            <p className="text-sm text-ink-soft">
              {t("products.turnaround")}: {product.turnaroundMonths}{" "}
              {t("products.months")}
            </p>
          </Link>

          <div className="mt-4 flex w-full flex-row flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            <FeaturedActions product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}

function GridCard({ product, index }: { product: Product; index: number }) {
  const t = useTranslations();
  const { formatPrice } = useRegion();
  const { ref, visible } = useRevealOnView<HTMLElement>();

  return (
    <article
      ref={ref}
      className={`group overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(43,33,28,0.06)] ring-1 ring-[color:var(--line)] transition-[box-shadow] duration-300 hover:shadow-[0_14px_32px_rgba(43,33,28,0.14)] ${revealClass(visible, "list-card")}`}
      style={
        visible
          ? { animationDelay: `${Math.min(index, 12) * 45}ms` }
          : undefined
      }
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-paper"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 280px"
        />
      </Link>
      <div className="space-y-2 bg-white px-[0.65rem] py-3 text-center sm:px-4 sm:py-4">
        <Link href={`/products/${product.slug}`} className="block space-y-1">
          <h3 className="card-title-fluid line-clamp-2 font-display text-ink">
            {product.name}
          </h3>
          <p className="text-[clamp(0.72rem,0.65rem+0.4vw,0.9375rem)] text-ink-soft">
            {t("products.from")} {formatPrice(product.priceFromUsd)}
          </p>
          {product.rating ? (
            <p className="text-[clamp(0.65rem,0.58rem+0.3vw,0.875rem)] text-honey">
              {product.rating.toFixed(1)} ★
            </p>
          ) : null}
        </Link>
        <div className="flex w-full flex-row items-center justify-center gap-1.5 pt-0.5 sm:gap-2">
          <FeaturedActions product={product} />
        </div>
      </div>
    </article>
  );
}

function SaleSection({ section }: { section: HomeSaleSection }) {
  if (section.blocks.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-14">
      <header className="mb-6 text-center sm:mb-8">
        <p className="text-[10px] tracking-[0.2em] text-accent uppercase">
          {section.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-[clamp(1.35rem,1.1rem+1.2vw,1.875rem)] text-ink">
          {section.title}
        </h2>
      </header>

      <div className="space-y-10 sm:space-y-12">
        {section.blocks.map((block) => {
          const featured = block.products.filter(
            (p) => p.displayMode === "featured",
          );
          const grid = block.products.filter(
            (p) => p.displayMode !== "featured",
          );

          return (
            <div key={block.category.id}>
              <Link
                href={`/collections/${block.category.slug}`}
                className="mb-4 flex items-end justify-between gap-3 sm:mb-5"
              >
                <span className="flex min-w-0 items-end gap-2.5 sm:gap-3">
                  <h3 className="font-display text-lg leading-none text-ink sm:text-xl">
                    {block.category.name}
                  </h3>
                  {block.category.hint ? (
                    <span className="pb-px text-[11px] leading-none text-[#9a8f86] sm:text-xs">
                      {block.category.hint}
                    </span>
                  ) : null}
                </span>
                <svg
                  className="mb-px h-3.5 w-3.5 shrink-0 text-[#9a8f86] sm:h-4 sm:w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 5.5 15.5 12 9 18.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

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
                    featured.length > 0 ? "mt-5 sm:mt-8" : ""
                  }`}
                >
                  {grid.map((product, index) => (
                    <GridCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ProductShowcase({
  sections,
}: {
  sections: HomeSaleSection[];
}) {
  const visible = sections.filter((section) => section.blocks.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="mx-auto mt-8 w-full max-w-[1200px] px-[4%] sm:mt-12 sm:px-6">
      {visible.map((section) => (
        <SaleSection key={section.saleType} section={section} />
      ))}
    </div>
  );
}
