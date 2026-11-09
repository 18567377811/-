"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/catalog";
import { formatUsd } from "@/lib/money";
import { useCartStore } from "@/store/cart";

export function CartView() {
  const t = useTranslations();
  const locale = useLocale();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [ready, setReady] = useState(false);

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
      product: (typeof products)[number];
      variant: (typeof products)[number]["variants"][number];
    }>;
  }, [items]);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.variant.priceUsd * line.item.quantity,
    0,
  );

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
        <Link href="/collections/portrait" className="btn-primary mt-8">
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
                alt={t(product.nameKey)}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">
                    {t(product.nameKey)}
                  </h2>
                  <p className="text-sm text-ink-soft">
                    {t(variant.labelKey)}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatUsd(variant.priceUsd * item.quantity, locale)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span>{t("cart.quantity")}</span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        Number(event.target.value),
                      )
                    }
                    className="w-16 rounded-lg border border-line bg-white/70 px-2 py-1"
                  />
                </label>
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
        <button type="button" className="btn-primary mt-6 w-full" disabled>
          {t("cart.checkout")}
        </button>
      </aside>
    </div>
  );
}
