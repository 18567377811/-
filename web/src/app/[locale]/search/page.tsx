import { setRequestLocale } from "next-intl/server";
import { SearchView } from "@/components/search/SearchView";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  return <SearchView initialQuery={(q ?? "").trim()} />;
}
