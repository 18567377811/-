export const heroSlides = [
  {
    id: "bond",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=80",
    titleKey: "home.slides.bond.title",
    bodyKey: "home.slides.bond.body",
  },
  {
    id: "craft",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=2000&q=80",
    titleKey: "home.slides.craft.title",
    bodyKey: "home.slides.craft.body",
  },
  {
    id: "keep",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2000&q=80",
    titleKey: "home.slides.keep.title",
    bodyKey: "home.slides.keep.body",
  },
] as const;

export const categoryEntries = [
  {
    slug: "portrait",
    href: "/collections/portrait",
    nameKey: "collections.portrait.name",
    hintKey: "home.categoryHints.portrait",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "miniature",
    href: "/collections/miniature",
    nameKey: "collections.miniature.name",
    hintKey: "home.categoryHints.miniature",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80",
  },
] as const;
