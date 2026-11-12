export type DisplayMode = "featured" | "grid";

export type SaleType = "direct" | "custom";

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
  label: string;
  labelZh?: string;
  labelEn?: string;
  labelMs?: string;
  priceUsd: number;
  /** @deprecated use label — kept for gradual migration */
  labelKey?: string;
};

export type Product = {
  id: string;
  slug: string;
  collection: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  summary: string;
  description: string;
  priceFromUsd: number;
  turnaroundMonths: string;
  rating?: number;
  image: string;
  variants: ProductVariant[];
  keywords?: string[];
  inStock?: boolean;
  displayMode?: DisplayMode;
  saleType?: SaleType;
  /** @deprecated use name — kept for gradual migration */
  nameKey?: string;
  summaryKey?: string;
  descriptionKey?: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  hint: string;
  heroImage: string;
  displayMode: DisplayMode;
  saleType: SaleType;
  showOnHome: boolean;
  sortOrder: number;
};

export type HomeCategoryBlock = {
  category: Collection;
  products: Product[];
};

export type HomeSaleSection = {
  saleType: SaleType;
  eyebrow: string;
  title: string;
  blocks: HomeCategoryBlock[];
};

export type HeroSlideView = {
  id: string;
  image: string;
  title: string;
  body: string;
};

export type CategoryEntry = {
  slug: string;
  href: string;
  name: string;
  hint: string;
  image: string;
};
