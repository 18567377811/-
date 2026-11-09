"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/commerce";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  clear: () => void;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (entry) =>
              entry.productId === item.productId &&
              entry.variantId === item.variantId,
          );

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId &&
                entry.variantId === item.variantId
                  ? {
                      ...entry,
                      quantity: entry.quantity + item.quantity,
                    }
                  : entry,
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (entry) =>
              !(
                entry.productId === productId && entry.variantId === variantId
              ),
          ),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (entry) =>
                    !(
                      entry.productId === productId &&
                      entry.variantId === variantId
                    ),
                )
              : state.items.map((entry) =>
                  entry.productId === productId &&
                  entry.variantId === variantId
                    ? { ...entry, quantity }
                    : entry,
                ),
        })),
      clear: () => set({ items: [] }),
      count: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: "feltora-cart" },
  ),
);
