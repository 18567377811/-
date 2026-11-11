"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatUsd } from "@/lib/money";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/commerce";

export function CartView({ products }: { products: Product[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [ready, setReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        const variant = product?.variants.find(
          (entry) => entry.id === item.variantId,
        );
        if (!product || !variant) return null;
        return { item, product, variant };
      })
      .filter(Boolean) as Array<{
      item: (typeof items)[number];
      product: Product;
      variant: Product["variants"][number];
    }>;
  }, [items, products]);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.variant.priceUsd * line.item.quantity,
    0,
  );

  async function startCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, locale }),
      });
      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !data.url) {
        throw new Error(data.error || t("cart.checkoutError"));
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cart.checkoutError"));
      setCheckingOut(false);
    }
  }

  if (!ready) {
    return (
      <div className="rounded-[1.5rem] border border-line bg-white/40 p-10 text-ink-soft">
        …
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-line bg-white/35 px-6 py-16 text-center">
        <p className="font-display text-3xl">{t("cart.empty")}</p>
        <Link href="/collections" className="btn-primary mt-8">
          {t("products.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <ul className="space-y-4">
        {lines.map(({ item, product, variant }) => (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 rounded-[1.25rem] border border-line bg-white/45 p-4"
          >
            <div className="relative h-28 w-24 overflow-hidden rounded-xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">{product.name}</h2>
                  <p className="text-sm text-ink-soft">{variant.label}</p>
                </div>
                <p className="font-semibold">
                  {formatUsd(variant.priceUsd * item.quantity, locale)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <QuantityStepper
                  id={`qty-${item.productId}-${item.variantId}`}
                  label={t("cart.quantity")}
                  value={item.quantity}
                  min={1}
                  max={20}
                  onChange={(quantity) =>
                    updateQuantity(item.productId, item.variantId, quantity)
                  }
                />
                <button
                  type="button"
                  className="text-sm text-clay hover:underline"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  {t("cart.remove")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[1.25rem] border border-line bg-white/55 p-6">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">{t("cart.subtotal")}</span>
          <span className="font-display text-3xl">
            {formatUsd(subtotal, locale)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {t("cart.note")}
        </p>
        {error ? (
          <p className="mt-3 text-sm text-clay" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
          disabled={checkingOut}
          onClick={startCheckout}
        >
          {checkingOut ? t("cart.checkoutLoading") : t("cart.checkout")}
        </button>
      </aside>
    </div>
  );
}
