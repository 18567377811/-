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

/** Footer payment marks shown on the storefront (PayPal Checkout). */
export const FOOTER_PAYMENT_METHODS = [
  "paypal",
  "visa",
  "mastercard",
] as const;

export type FooterPaymentMethod = (typeof FOOTER_PAYMENT_METHODS)[number];
