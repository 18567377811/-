import { products } from "@/data/catalog";
import type { Product } from "@/types/commerce";

export type SearchSort = "relevance" | "price-asc" | "price-desc";

export type SearchFilters = {
  query: string;
  inStockOnly: boolean;
  priceMin: number;
  priceMax: number;
  sort: SearchSort;
};

export const SEARCH_PRICE_BOUNDS = { min: 0, max: 1500 } as const;

type TranslateFn = (key: string) => string;

function haystack(product: Product, t: TranslateFn) {
  return [
    product.slug,
    product.id,
    product.collection,
    t(product.nameKey),
    t(product.summaryKey),
    ...(product.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterProducts(
  filters: SearchFilters,
  t: TranslateFn,
): Product[] {
  const q = filters.query.trim().toLowerCase();
  let list = products.filter((product) => {
    if (filters.inStockOnly && product.inStock === false) return false;
    if (product.priceFromUsd < filters.priceMin) return false;
    if (product.priceFromUsd > filters.priceMax) return false;
    if (!q) return true;
    return haystack(product, t).includes(q);
  });

  if (filters.sort === "price-asc") {
    list = [...list].sort((a, b) => a.priceFromUsd - b.priceFromUsd);
  } else if (filters.sort === "price-desc") {
    list = [...list].sort((a, b) => b.priceFromUsd - a.priceFromUsd);
  } else if (q) {
    list = [...list].sort((a, b) => {
      const aName = t(a.nameKey).toLowerCase();
      const bName = t(b.nameKey).toLowerCase();
      const aScore = aName.includes(q) ? 0 : 1;
      const bScore = bName.includes(q) ? 0 : 1;
      return aScore - bScore;
    });
  }

  return list;
}
