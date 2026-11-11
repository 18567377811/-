import { getLocale, setRequestLocale } from "next-intl/server";
import { SearchView } from "@/components/search/SearchView";
import { listProducts } from "@/lib/catalog-queries";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale: routeLocale } = await params;
  const { q } = await searchParams;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const products = await listProducts(locale);

  return (
    <SearchView
      initialQuery={(q ?? "").trim()}
      products={products}
    />
  );
}
