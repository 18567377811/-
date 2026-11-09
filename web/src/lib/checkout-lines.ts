import en from "../../messages/en.json";
import { products } from "@/data/catalog";
import type { CartItem } from "@/types/commerce";

type MessageTree = Record<string, unknown>;

function messageAt(path: string): string {
  const parts = path.split(".");
  let cursor: unknown = en as MessageTree;
  for (const part of parts) {
    if (!cursor || typeof cursor !== "object" || !(part in cursor)) {
      return path;
    }
    cursor = (cursor as MessageTree)[part];
  }
  return typeof cursor === "string" ? cursor : path;
}

export type CheckoutLine = {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  variantLabel: string;
  unitAmountCents: number;
  image?: string;
};

export function resolveCheckoutLines(items: CartItem[]): CheckoutLine[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  return items.map((item) => {
    if (
      !item?.productId ||
      !item?.variantId ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    ) {
      throw new Error("Invalid cart item");
    }

    const product = products.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find(
      (entry) => entry.id === item.variantId,
    );
    if (!product || !variant) {
      throw new Error("Unknown product or variant");
    }

    return {
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      name: messageAt(product.nameKey),
      variantLabel: messageAt(variant.labelKey),
      unitAmountCents: Math.round(variant.priceUsd * 100),
      image: product.image,
    };
  });
}
