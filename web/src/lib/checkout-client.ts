import type { CartItem } from "@/types/commerce";

export async function startStripeCheckout(options: {
  items: CartItem[];
  locale: string;
  /** Relative path after locale, e.g. `/products/foo` or `/cart` */
  cancelPath?: string;
}): Promise<void> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: options.items,
      locale: options.locale,
      cancelPath: options.cancelPath || "/cart",
    }),
  });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) {
    throw new Error(data.error || "Checkout failed");
  }
  window.location.assign(data.url);
}
