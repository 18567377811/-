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
  HomeCategoryBlock,
  HomeSaleSection,
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
    saleType: (product.category.saleType || product.saleType) as SaleType,
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
    saleType: category.saleType as SaleType,
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

function homeCopy(locale: string, saleType: SaleType) {
  if (saleType === "direct") {
    return {
      eyebrow:
        locale === "zh"
          ? "直售作品"
          : locale === "ms"
            ? "Jualan terus"
            : "Ready to ship",
      title:
        locale === "zh"
          ? "选好就带走的温柔"
          : locale === "ms"
            ? "Pilih dan bawa pulang"
            : "Choose and take home",
    };
  }
  return {
    eyebrow:
      locale === "zh"
        ? "定制作品"
        : locale === "ms"
          ? "Komisen"
          : "Commissions",
    title:
      locale === "zh"
        ? "为它留下一份温度"
        : locale === "ms"
          ? "Kenangan yang hangat"
          : "A keepsake of warmth",
  };
}

export async function getHomePayload(locale: string) {
  const [slides, categoryRows] = await Promise.all([
    listHeroSlides(locale),
    prisma.category.findMany({
      where: { isActive: true, showOnHome: true },
      include: {
        products: {
          where: { isActive: true },
          include: { variants: true, category: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const categories = categoryRows.map((row) => mapCategoryEntry(row, locale));

  function blocksFor(saleType: SaleType): HomeCategoryBlock[] {
    return categoryRows
      .filter((row) => row.saleType === saleType && row.products.length > 0)
      .map((row) => ({
        category: mapCategory(row, locale),
        products: row.products.map((product) =>
          mapProduct(
            { ...product, category: row },
            locale,
          ),
        ),
      }));
  }

  const customCopy = homeCopy(locale, "custom");
  const directCopy = homeCopy(locale, "direct");

  const custom: HomeSaleSection = {
    saleType: "custom",
    eyebrow: customCopy.eyebrow,
    title: customCopy.title,
    blocks: blocksFor("custom"),
  };
  const direct: HomeSaleSection = {
    saleType: "direct",
    eyebrow: directCopy.eyebrow,
    title: directCopy.title,
    blocks: blocksFor("direct"),
  };

  // Backward-compatible flat lists (API / older callers)
  const products = [...custom.blocks, ...direct.blocks].flatMap(
    (block) => block.products,
  );
  const featured = products.filter((p) => p.displayMode === "featured");
  const grid = products.filter((p) => p.displayMode !== "featured");

  return { categories, slides, custom, direct, featured, grid, products };
}
