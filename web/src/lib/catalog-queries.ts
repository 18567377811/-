import type {
  Category,
  HeroSlide,
  Product,
  ProductVariant,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { parseKeywords, pickLocale } from "@/lib/locale-text";
import type {
  CategoryEntry,
  Collection,
  DisplayMode,
  HeroSlideView,
  Product as ProductView,
  ProductVariant as VariantView,
  SaleType,
} from "@/types/commerce";

type ProductWithRelations = Product & {
  variants: ProductVariant[];
  category: Category;
};

function mapVariant(
  variant: ProductVariant,
  locale: string,
): VariantView {
  return {
    id: variant.id,
    label: pickLocale(locale, {
      zh: variant.labelZh,
      en: variant.labelEn,
      ms: variant.labelMs,
    }),
    labelZh: variant.labelZh,
    labelEn: variant.labelEn,
    labelMs: variant.labelMs,
    priceUsd: variant.priceUsd,
  };
}

export function mapProduct(
  product: ProductWithRelations,
  locale: string,
): ProductView {
  const variants = [...product.variants].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  return {
    id: product.id,
    slug: product.slug,
    collection: product.category.slug,
    categoryId: product.categoryId,
    categorySlug: product.category.slug,
    categoryName: pickLocale(locale, {
      zh: product.category.nameZh,
      en: product.category.nameEn,
      ms: product.category.nameMs,
    }),
    name: pickLocale(locale, {
      zh: product.nameZh,
      en: product.nameEn,
      ms: product.nameMs,
    }),
    summary: pickLocale(locale, {
      zh: product.summaryZh,
      en: product.summaryEn,
      ms: product.summaryMs,
    }),
    description: pickLocale(locale, {
      zh: product.descriptionZh,
      en: product.descriptionEn,
      ms: product.descriptionMs,
    }),
    priceFromUsd: product.priceFromUsd,
    turnaroundMonths: product.turnaroundMonths,
    rating: product.rating ?? undefined,
    image: product.image,
    variants: variants.map((variant) => mapVariant(variant, locale)),
    keywords: parseKeywords(product.keywords),
    inStock: product.inStock,
    displayMode: product.category.displayMode as DisplayMode,
    saleType: product.saleType as SaleType,
  };
}

export function mapCategory(category: Category, locale: string): Collection {
  return {
    id: category.id,
    slug: category.slug,
    name: pickLocale(locale, {
      zh: category.nameZh,
      en: category.nameEn,
      ms: category.nameMs,
    }),
    description: pickLocale(locale, {
      zh: category.descriptionZh,
      en: category.descriptionEn,
      ms: category.descriptionMs,
    }),
    hint: pickLocale(locale, {
      zh: category.hintZh,
      en: category.hintEn,
      ms: category.hintMs,
    }),
    heroImage: category.coverImage,
    displayMode: category.displayMode as DisplayMode,
    showOnHome: category.showOnHome,
    sortOrder: category.sortOrder,
  };
}

export function mapCategoryEntry(
  category: Category,
  locale: string,
): CategoryEntry {
  return {
    slug: category.slug,
    href: `/collections/${category.slug}`,
    name: pickLocale(locale, {
      zh: category.nameZh,
      en: category.nameEn,
      ms: category.nameMs,
    }),
    hint: pickLocale(locale, {
      zh: category.hintZh,
      en: category.hintEn,
      ms: category.hintMs,
    }),
    image: category.coverImage,
  };
}

export function mapHeroSlide(
  slide: HeroSlide,
  locale: string,
): HeroSlideView {
  return {
    id: slide.id,
    image: slide.image,
    title: pickLocale(locale, {
      zh: slide.titleZh,
      en: slide.titleEn,
      ms: slide.titleMs,
    }),
    body: pickLocale(locale, {
      zh: slide.bodyZh,
      en: slide.bodyEn,
      ms: slide.bodyMs,
    }),
  };
}

const productInclude = {
  variants: true,
  category: true,
} as const;

export async function listActiveCategories(locale: string) {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => mapCategory(row, locale));
}

export async function listHomeCategories(locale: string) {
  const rows = await prisma.category.findMany({
    where: { isActive: true, showOnHome: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => mapCategoryEntry(row, locale));
}

export async function getCategoryBySlug(slug: string, locale: string) {
  const row = await prisma.category.findFirst({
    where: { slug, isActive: true },
  });
  return row ? mapCategory(row, locale) : null;
}

export async function listProducts(locale: string) {
  const rows = await prisma.product.findMany({
    where: { isActive: true, category: { isActive: true } },
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => mapProduct(row, locale));
}

export async function getProductsByCategorySlug(
  slug: string,
  locale: string,
) {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug, isActive: true },
    },
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => mapProduct(row, locale));
}

export async function getProductBySlug(slug: string, locale: string) {
  const row = await prisma.product.findFirst({
    where: { slug, isActive: true, category: { isActive: true } },
    include: productInclude,
  });
  return row ? mapProduct(row, locale) : null;
}

export async function getProductById(id: string, locale = "en") {
  const row = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: productInclude,
  });
  return row ? mapProduct(row, locale) : null;
}

export async function listHeroSlides(locale: string) {
  const rows = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => mapHeroSlide(row, locale));
}

export async function getHomePayload(locale: string) {
  const [categories, slides, products] = await Promise.all([
    listHomeCategories(locale),
    listHeroSlides(locale),
    listProducts(locale),
  ]);

  const featured = products.filter((p) => p.displayMode === "featured");
  const grid = products.filter((p) => p.displayMode !== "featured");

  return { categories, slides, featured, grid, products };
}
