"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatUsd } from "@/lib/money";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/commerce";

export function AddToCartForm({ product }: { product: Product }) {
  const t = useTranslations();
  const locale = useLocale();
  const addItem = useCartStore((state) => state.addItem);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!selected) return;
        addItem({
          productId: product.id,
          variantId: selected.id,
          quantity: 1,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">
          {t("products.chooseVariant")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => {
            const active = variant.id === variantId;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setVariantId(variant.id)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-white hover:border-accent/40"
                }`}
              >
                {t(variant.labelKey)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{t("products.from")}</p>
          <p className="font-display text-3xl">
            {formatUsd(selected?.priceUsd ?? product.priceFromUsd, locale)}
          </p>
        </div>
        <button type="submit" className="btn-primary min-w-40">
          {added ? "✓" : t("products.addToCart")}
        </button>
      </div>
    </form>
  );
}
