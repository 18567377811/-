import { getProductById } from "@/lib/catalog-queries";
import type { CartItem } from "@/types/commerce";

export type CheckoutLine = {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  variantLabel: string;
  unitAmountCents: number;
  image?: string;
};

export async function resolveCheckoutLines(
  items: CartItem[],
): Promise<CheckoutLine[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const lines: CheckoutLine[] = [];

  for (const item of items) {
    if (
      !item?.productId ||
      !item?.variantId ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    ) {
      throw new Error("Invalid cart item");
    }

    const product = await getProductById(item.productId, "en");
    const variant = product?.variants.find(
      (entry) => entry.id === item.variantId,
    );
    if (!product || !variant) {
      throw new Error("Unknown product or variant");
    }

    lines.push({
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      name: product.name,
      variantLabel: variant.label,
      unitAmountCents: Math.round(variant.priceUsd * 100),
      image: product.image,
    });
  }

  return lines;
}
