"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContactUsButton } from "@/components/layout/social";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useRegion } from "@/components/layout/RegionProvider";
import { startStripeCheckout } from "@/lib/checkout-client";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/commerce";

export function AddToCartForm({ product }: { product: Product }) {
  const t = useTranslations();
  const locale = useLocale();
  const { formatPrice } = useRegion();
  const addItem = useCartStore((state) => state.addItem);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCustom = product.saleType !== "direct";

  const selected = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  if (isCustom) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-ink-soft">{t("products.from")}</p>
          <p className="font-display text-3xl">
            {formatPrice(product.priceFromUsd)}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">
          {locale === "zh"
            ? "定制商品需先提交委托申请，确认方案后再付款。"
            : "Custom commissions start with a request form — no charge until you approve the plan."}
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <ContactUsButton className="btn-secondary inline-flex min-w-36" />
          <Link
            href={`/commission/${product.slug}`}
            className="btn-primary inline-flex min-w-40"
          >
            {t("products.startCommission")}
          </Link>
        </div>
      </div>
    );
  }

  async function buyNow() {
    if (!selected || buying) return;
    setError(null);
    setBuying(true);
    try {
      await startStripeCheckout({
        items: [
          {
            productId: product.id,
            variantId: selected.id,
            quantity,
          },
        ],
        locale,
        cancelPath: `/products/${product.slug}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("products.buying"));
      setBuying(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!selected) return;
        addItem({
          productId: product.id,
          variantId: selected.id,
          quantity,
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
                {variant.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <QuantityStepper
        id={`add-${product.id}`}
        label={t("cart.quantity")}
        value={quantity}
        min={1}
        max={20}
        onChange={setQuantity}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{t("products.from")}</p>
          <p className="font-display text-3xl">
            {formatPrice(selected?.priceUsd ?? product.priceFromUsd)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button type="submit" className="btn-secondary min-w-36">
            {added ? "✓" : t("products.addToCart")}
          </button>
          <button
            type="button"
            className="btn-primary min-w-36"
            disabled={buying || !selected}
            onClick={() => void buyNow()}
          >
            {buying ? t("products.buying") : t("products.buyNow")}
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
