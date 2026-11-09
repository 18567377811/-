import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Prefer a restricted key (rk_…) over a full secret key (sk_…) when possible. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeClient) {
    // stripe-node 23 uses the latest API version shipped with the SDK
    stripeClient = new Stripe(key, {
      typescript: true,
      appInfo: {
        name: "Feltora",
        url: "https://thestoryofawool.me",
      },
    });
  }
  return stripeClient;
}

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  return url;
}

/** Fulfill only after funds are settled / will settle (never while unpaid). */
export function isSessionPaid(session: Stripe.Checkout.Session) {
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}
