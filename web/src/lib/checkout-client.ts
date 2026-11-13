import type { CartItem } from "@/types/commerce";

export function isPayPalClientEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
}

/** Same UX as the old Stripe Checkout: create order → redirect to PayPal. */
export async function startPayPalCheckout(options: {
  items: CartItem[];
  locale: string;
  /** Relative path after locale, e.g. `/products/foo` or `/cart` */
  cancelPath?: string;
}): Promise<void> {
  const response = await fetch("/api/paypal/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: options.items,
      locale: options.locale,
      cancelPath: options.cancelPath || "/cart",
    }),
  });
  const data = (await response.json()) as {
    url?: string;
    id?: string;
    error?: string;
  };
  if (!response.ok || !data.url) {
    throw new Error(data.error || "Checkout failed");
  }
  window.location.assign(data.url);
}
