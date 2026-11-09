"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";

export function CartBadge() {
  const t = useTranslations("nav");
  const items = useCartStore((state) => state.items);
  const [ready, setReady] = useState(false);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-2.5 py-1.5 text-xs font-medium transition hover:bg-blush/40 sm:gap-2 sm:px-3 sm:text-sm"
    >
      <span>{t("cart")}</span>
      <span className="tabular-nums text-accent">{ready ? count : 0}</span>
    </Link>
  );
}
