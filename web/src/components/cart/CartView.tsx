"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import {
  isPayPalClientEnabled,
  startPayPalCheckout,
} from "@/lib/checkout-client";
import { useRegion } from "@/components/layout/RegionProvider";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/commerce";

function lineKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function CartView({ products }: { products: Product[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const { formatPrice } = useRegion();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [ready, setReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      for (const line of lines) {
        const key = lineKey(line.item.productId, line.item.variantId);
        next[key] = prev[key] ?? true;
      }
      return next;
    });
  }, [lines]);

  const selectedLines = lines.filter(
    (line) => selected[lineKey(line.item.productId, line.item.variantId)],
  );

  const allSelected =
    lines.length > 0 && selectedLines.length === lines.length;

  const subtotal = selectedLines.reduce(
    (sum, line) => sum + line.variant.priceUsd * line.item.quantity,
    0,
  );

  function toggleAll(checked: boolean) {
    const next: Record<string, boolean> = {};
    for (const line of lines) {
      next[lineKey(line.item.productId, line.item.variantId)] = checked;
    }
    setSelected(next);
  }

  const paypalEnabled = isPayPalClientEnabled();
  const checkoutItems = selectedLines.map((line) => ({
    productId: line.item.productId,
    variantId: line.item.variantId,
    quantity: line.item.quantity,
  }));

  async function startCheckout() {
    setError(null);
    if (selectedLines.length === 0) {
      setError(
        locale === "zh" ? "请先勾选要结算的商品" : "Select items to checkout",
      );
      return;
    }
    if (!paypalEnabled) {
      setError(t("cart.noPaymentConfigured"));
      return;
    }
    setCheckingOut(true);
    try {
      await startPayPalCheckout({
        items: checkoutItems,
        locale,
        cancelPath: "/cart",
      });
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
      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 px-1 text-sm text-ink-soft">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--accent)]"
            checked={allSelected}
            onChange={(event) => toggleAll(event.target.checked)}
          />
          {locale === "zh"
            ? `全选（已选 ${selectedLines.length}/${lines.length}）`
            : `Select all (${selectedLines.length}/${lines.length})`}
        </label>

        <ul className="space-y-4">
          {lines.map(({ item, product, variant }) => {
            const key = lineKey(item.productId, item.variantId);
            const checked = Boolean(selected[key]);
            return (
              <li
                key={key}
                className="flex gap-3 rounded-[1.25rem] border border-line bg-white/45 p-4 sm:gap-4"
              >
                <input
                  type="checkbox"
                  className="mt-10 h-4 w-4 shrink-0 accent-[var(--accent)]"
                  checked={checked}
                  aria-label={
                    locale === "zh"
                      ? `选择 ${product.name}`
                      : `Select ${product.name}`
                  }
                  onChange={(event) =>
                    setSelected((prev) => ({
                      ...prev,
                      [key]: event.target.checked,
                    }))
                  }
                />
                <Link
                  href={`/products/${product.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-[color:var(--line)] transition hover:opacity-90"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display text-xl text-ink transition hover:text-accent"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-ink-soft">{variant.label}</p>
                    </div>
                    <p className="shrink-0 font-semibold">
                      {formatPrice(variant.priceUsd * item.quantity)}
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
            );
          })}
        </ul>
      </div>

      <aside className="h-fit rounded-[1.25rem] border border-line bg-white/55 p-6">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">{t("cart.subtotal")}</span>
          <span className="font-display text-3xl">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          {locale === "zh"
            ? `结算 ${selectedLines.length} 件已勾选商品`
            : `${selectedLines.length} selected item(s)`}
        </p>
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
          disabled={checkingOut || selectedLines.length === 0 || !paypalEnabled}
          onClick={() => void startCheckout()}
        >
          {checkingOut ? t("cart.checkoutLoading") : t("cart.checkout")}
        </button>
        {!paypalEnabled ? (
          <p className="mt-3 text-sm text-clay" role="alert">
            {t("cart.noPaymentConfigured")}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
