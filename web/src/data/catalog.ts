import type { Collection, Product } from "@/types/commerce";

export const collections: Collection[] = [
  {
    slug: "portrait",
    nameKey: "collections.portrait.name",
    descriptionKey: "collections.portrait.description",
    heroImage:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80",
    displayMode: "featured",
  },
  {
    slug: "miniature",
    nameKey: "collections.miniature.name",
    descriptionKey: "collections.miniature.description",
    heroImage:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80",
    displayMode: "grid",
  },
];

export const products: Product[] = [
  {
    id: "portrait-dog",
    slug: "framed-pet-portrait-dog",
    collection: "portrait",
    nameKey: "products.portraitDog.name",
    summaryKey: "products.portraitDog.summary",
    descriptionKey: "products.portraitDog.description",
    priceFromUsd: 680,
    turnaroundMonths: "3–8",
    rating: 5,
    inStock: true,
    keywords: ["dog", "犬", "狗", "portrait", "肖像", "framed"],
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    variants: [
      {
        id: "dog-solid",
        labelKey: "products.variants.solidBicolor",
        priceUsd: 680,
      },
      {
        id: "dog-complex",
        labelKey: "products.variants.complexCoat",
        priceUsd: 780,
      },
    ],
  },
  {
    id: "portrait-cat",
    slug: "framed-pet-portrait-cat",
    collection: "portrait",
    nameKey: "products.portraitCat.name",
    summaryKey: "products.portraitCat.summary",
    descriptionKey: "products.portraitCat.description",
    priceFromUsd: 680,
    turnaroundMonths: "3–8",
    rating: 5,
    inStock: true,
    keywords: ["cat", "猫", "portrait", "肖像", "framed"],
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    variants: [
      {
        id: "cat-solid",
        labelKey: "products.variants.solidBicolor",
        priceUsd: 680,
      },
      {
        id: "cat-tabby",
        labelKey: "products.variants.tabbyTortie",
        priceUsd: 780,
      },
    ],
  },
  {
    id: "mini-full",
    slug: "full-body-figurine",
    collection: "miniature",
    nameKey: "products.fullBody.name",
    summaryKey: "products.fullBody.summary",
    descriptionKey: "products.fullBody.description",
    priceFromUsd: 850,
    turnaroundMonths: "4–10",
    rating: 4.9,
    inStock: true,
    keywords: ["dog", "犬", "狗", "figurine", "miniature", "迷你", "全身", "full body"],
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
    variants: [
      {
        id: "full-standard",
        labelKey: "products.variants.standard",
        priceUsd: 850,
      },
      {
        id: "full-poseable",
        labelKey: "products.variants.poseablePaws",
        priceUsd: 980,
      },
    ],
  },
  {
    id: "mini-small",
    slug: "mini-full-body-figurine",
    collection: "miniature",
    nameKey: "products.miniFullBody.name",
    summaryKey: "products.miniFullBody.summary",
    descriptionKey: "products.miniFullBody.description",
    priceFromUsd: 500,
    turnaroundMonths: "3–7",
    rating: 4.9,
    inStock: true,
    keywords: ["dog", "犬", "狗", "mini", "miniature", "迷你", "全身", "7cm", "10cm"],
    image:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
    variants: [
      {
        id: "mini-7cm",
        labelKey: "products.variants.size7to10",
        priceUsd: 500,
      },
    ],
  },
];

export function getCollection(slug: string) {
  return collections.find((item) => item.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((item) => item.collection === slug);
}
