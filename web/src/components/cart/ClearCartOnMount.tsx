"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Clears local cart after a successful Stripe redirect. */
export function ClearCartOnMount() {
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
