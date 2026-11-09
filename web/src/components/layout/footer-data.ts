/** Update these when social accounts are ready. Empty href = icon shown, not linked. */
export const SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "",
  },
] as const;

/**
 * Methods aligned with Stripe Checkout for Feltora:
 * cards + wallets Stripe enables by default for USD / overseas Checkout.
 * (No Shop Pay — that’s Shopify; no PayPal unless separately enabled.)
 */
export const STRIPE_FOOTER_METHODS = [
  "visa",
  "mastercard",
  "amex",
  "unionpay",
  "discover",
  "jcb",
  "applepay",
  "googlepay",
  "link",
] as const;

export type StripeFooterMethod = (typeof STRIPE_FOOTER_METHODS)[number];
