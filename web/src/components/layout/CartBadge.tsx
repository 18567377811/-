"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { CartIcon } from "./HeaderIcons";

export function CartBadge() {
  const t = useTranslations("nav");
  const items = useCartStore((state) => state.items);
  const [ready, setReady] = useState(false);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setReady(true);
  }, []);

  const display = ready ? count : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/55"
      aria-label={`${t("cart")}${display > 0 ? ` ${display}` : ""}`}
    >
      <CartIcon className="h-[1.15rem] w-[1.15rem]" />
      {display > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-[#e24b4b] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
          {display > 99 ? "99+" : display}
        </span>
      ) : null}
    </Link>
  );
}
