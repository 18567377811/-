export type CollectionSlug = "portrait" | "miniature";

/** Admin-configurable list layout for products in a category */
export type CollectionDisplayMode = "featured" | "grid";

export type CommissionStatus =
  | "paid"
  | "awaiting_photos"
  | "in_production"
  | "preview_sent"
  | "revision"
  | "approved"
  | "shipped"
  | "completed";

export type ProductVariant = {
  id: string;
  labelKey: string;
  priceUsd: number;
};

export type Product = {
  id: string;
  slug: string;
  collection: CollectionSlug;
  nameKey: string;
  summaryKey: string;
  descriptionKey: string;
  priceFromUsd: number;
  turnaroundMonths: string;
  rating?: number;
  image: string;
  variants: ProductVariant[];
  /** Extra search tokens (en/zh/ms aliases) */
  keywords?: string[];
  inStock?: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type Collection = {
  slug: CollectionSlug;
  nameKey: string;
  descriptionKey: string;
  heroImage: string;
  /** How products in this category render on home / listing */
  displayMode: CollectionDisplayMode;
};
