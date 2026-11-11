"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { FiltersIcon, SearchIcon } from "@/components/layout/HeaderIcons";
import {
  SEARCH_PRICE_BOUNDS,
  filterProducts,
  type SearchFilters,
  type SearchSort,
} from "@/lib/search";
import type { Product } from "@/types/commerce";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { SearchFilterSheet } from "./SearchFilterSheet";
import { SearchProductCard } from "./SearchProductCard";

type Props = {
  initialQuery: string;
  products: Product[];
};

function countActiveFilters(filters: SearchFilters) {
  let count = 0;
  if (filters.inStockOnly) count += 1;
  if (filters.priceMin > SEARCH_PRICE_BOUNDS.min) count += 1;
  if (filters.priceMax < SEARCH_PRICE_BOUNDS.max) count += 1;
  if (filters.sort !== "relevance") count += 1;
  return count;
}

export function SearchView({ initialQuery, products }: Props) {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    inStockOnly: false,
    priceMin: SEARCH_PRICE_BOUNDS.min,
    priceMax: SEARCH_PRICE_BOUNDS.max,
    sort: "relevance",
  });
  const [draft, setDraft] = useState(filters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openSort, setOpenSort] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    setFilters((prev) => ({ ...prev, query: initialQuery }));
    setDraft((prev) => ({ ...prev, query: initialQuery }));
  }, [initialQuery]);

  const results = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  function commitQuery(nextQuery: string) {
    const trimmed = nextQuery.trim();
    setFilters((prev) => ({ ...prev, query: trimmed }));
    setDraft((prev) => ({ ...prev, query: trimmed }));
    bumpCards();
    startTransition(() => {
      const href = trimmed
        ? `${pathname}?q=${encodeURIComponent(trimmed)}`
        : pathname;
      router.replace(href);
    });
  }

  function bumpCards() {
    setFading(true);
    window.setTimeout(() => {
      setAnimKey((key) => key + 1);
      setFading(false);
    }, 160);
  }

  function applyDesktopFilters(next: SearchFilters) {
    setFilters(next);
    setDraft(next);
    bumpCards();
  }

  function applySheet() {
    setFilters({ ...draft, query: query.trim() });
    setSheetOpen(false);
    bumpCards();
  }

  const activeCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-6xl px-3 pt-10 pb-28 sm:px-6 sm:pt-12 sm:pb-20">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl text-ink sm:text-5xl">
          {filters.query
            ? t("resultsFor", { count: results.length, query: filters.query })
            : t("browseTitle", { count: results.length })}
        </h1>

        <form
          className="mt-8"
          onSubmit={(event) => {
            event.preventDefault();
            commitQuery(query);
          }}
        >
          <label className="relative mx-auto flex max-w-xl items-center border-b border-line pb-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("placeholder")}
              className="w-full bg-transparent pr-10 text-base text-ink outline-none placeholder:text-ink-soft/70 sm:text-lg"
              aria-label={t("placeholder")}
            />
            <button
              type="submit"
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-white/70 hover:text-accent"
              aria-label={t("submit")}
            >
              <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
            </button>
          </label>
        </form>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[1.5rem] border border-line bg-white/45 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink uppercase">
              <FiltersIcon className="h-4 w-4" />
              {t("filters")}
            </h2>
            <div className="mt-2">
              <SearchFilterPanel
                draft={filters}
                onChange={applyDesktopFilters}
                openSort={openSort}
                openPrice={openPrice}
                onToggleSort={() => setOpenSort((v) => !v)}
                onTogglePrice={() => setOpenPrice((v) => !v)}
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.inStockOnly ? (
                <button
                  type="button"
                  className="rounded-full bg-white/80 px-3 py-1.5 text-xs text-ink ring-1 ring-[color:var(--line)]"
                  onClick={() =>
                    applyDesktopFilters({ ...filters, inStockOnly: false })
                  }
                >
                  {t("inStockOnly")} ×
                </button>
              ) : null}
            </div>

            <div className="relative hidden lg:block">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm text-ink ring-1 ring-[color:var(--line)]"
                onClick={() => setDesktopSortOpen((v) => !v)}
              >
                {t("sortBy")}: {t(`sort.${filters.sort}`)}
              </button>
              <div
                className={`absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-[#fffdf9] shadow-[0_16px_40px_rgba(43,33,28,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  desktopSortOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                {(
                  ["relevance", "price-asc", "price-desc"] as SearchSort[]
                ).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-blush/35 ${
                      filters.sort === option
                        ? "bg-blush/40 font-semibold text-accent-deep"
                        : "text-ink"
                    }`}
                    onClick={() => {
                      applyDesktopFilters({ ...filters, sort: option });
                      setDesktopSortOpen(false);
                    }}
                  >
                    {t(`sort.${option}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 transition-opacity duration-300 ease-out ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            key={animKey}
          >
            {results.map((product, index) => (
              <SearchProductCard
                key={`${animKey}-${product.id}`}
                product={product}
                index={index}
                animKey={`${animKey}-${locale}`}
              />
            ))}
          </div>

          {results.length === 0 ? (
            <p className="mt-10 text-center text-ink-soft">{t("empty")}</p>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-5 z-30 flex justify-center px-4 lg:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(154,91,69,0.28)]"
          onClick={() => {
            setDraft(filters);
            setSheetOpen(true);
          }}
        >
          <FiltersIcon className="h-4 w-4" />
          {t("filterAndSort")}
          {activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <SearchFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        draft={draft}
        onChange={setDraft}
        openSort={openSort}
        openPrice={openPrice}
        onToggleSort={() => setOpenSort((v) => !v)}
        onTogglePrice={() => setOpenPrice((v) => !v)}
        applyCount={countActiveFilters({ ...draft, query: query.trim() })}
        onApply={applySheet}
      />
    </div>
  );
}
