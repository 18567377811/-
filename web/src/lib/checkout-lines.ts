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

/** Stripe only accepts absolute http(s) image URLs — skip local /uploads paths. */
function stripeSafeImage(image?: string): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return undefined;
}

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
    if (product.saleType !== "direct") {
      throw new Error("Custom products cannot be checked out directly");
    }

    lines.push({
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      name: product.name,
      variantLabel: variant.label,
      unitAmountCents: Math.round(variant.priceUsd * 100),
      image: stripeSafeImage(product.image),
    });
  }

  return lines;
}
