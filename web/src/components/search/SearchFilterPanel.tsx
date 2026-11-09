"use client";

import { useTranslations } from "next-intl";
import { ChevronIcon } from "@/components/layout/HeaderIcons";
import {
  SEARCH_PRICE_BOUNDS,
  type SearchFilters,
  type SearchSort,
} from "@/lib/search";

type Props = {
  draft: SearchFilters;
  onChange: (next: SearchFilters) => void;
  openSort: boolean;
  openPrice: boolean;
  onToggleSort: () => void;
  onTogglePrice: () => void;
  showApply?: boolean;
  applyCount?: number;
  onApply?: () => void;
};

const SORT_OPTIONS: SearchSort[] = ["relevance", "price-asc", "price-desc"];

export function SearchFilterPanel({
  draft,
  onChange,
  openSort,
  openPrice,
  onToggleSort,
  onTogglePrice,
  showApply,
  applyCount,
  onApply,
}: Props) {
  const t = useTranslations("search");

  return (
    <div className="space-y-1">
      <section className="border-b border-line/80 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          aria-expanded={openSort}
          onClick={onToggleSort}
        >
          <span className="text-sm font-semibold text-ink">{t("sortBy")}</span>
          <ChevronIcon
            className="h-4 w-4 text-ink-soft transition-transform duration-300"
            direction={openSort ? "up" : "down"}
          />
        </button>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            openSort ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 pt-3 pb-1">
              {SORT_OPTIONS.map((option) => {
                const active = draft.sort === option;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left text-sm text-ink transition hover:bg-white/60"
                      onClick={() => onChange({ ...draft, sort: option })}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          active
                            ? "border-accent bg-accent text-white"
                            : "border-line bg-white"
                        }`}
                      >
                        {active ? "✓" : null}
                      </span>
                      {t(`sort.${option}`)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">
            {t("inStockOnly")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={draft.inStockOnly}
            onClick={() =>
              onChange({ ...draft, inStockOnly: !draft.inStockOnly })
            }
            className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
              draft.inStockOnly ? "bg-accent" : "bg-[#d9cfc4]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                draft.inStockOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="py-3">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          aria-expanded={openPrice}
          onClick={onTogglePrice}
        >
          <span className="text-sm font-semibold text-ink">{t("price")}</span>
          <ChevronIcon
            className="h-4 w-4 text-ink-soft transition-transform duration-300"
            direction={openPrice ? "up" : "down"}
          />
        </button>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            openPrice
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-4 pb-1">
              <input
                type="range"
                min={SEARCH_PRICE_BOUNDS.min}
                max={SEARCH_PRICE_BOUNDS.max}
                step={10}
                value={draft.priceMax}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    priceMax: Number(event.target.value),
                    priceMin: Math.min(
                      draft.priceMin,
                      Number(event.target.value),
                    ),
                  })
                }
                className="search-range w-full"
                aria-label={t("priceTo")}
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-xs text-ink-soft">
                  <span>{t("priceFrom")}</span>
                  <input
                    type="number"
                    min={SEARCH_PRICE_BOUNDS.min}
                    max={draft.priceMax}
                    value={draft.priceMin}
                    onChange={(event) =>
                      onChange({
                        ...draft,
                        priceMin: Math.max(
                          SEARCH_PRICE_BOUNDS.min,
                          Number(event.target.value) || 0,
                        ),
                      })
                    }
                    className="w-full rounded-xl border border-line bg-white/80 px-3 py-2.5 text-sm text-ink outline-none focus:border-accent/40"
                  />
                </label>
                <label className="space-y-1 text-xs text-ink-soft">
                  <span>{t("priceTo")}</span>
                  <input
                    type="number"
                    min={draft.priceMin}
                    max={SEARCH_PRICE_BOUNDS.max}
                    value={draft.priceMax}
                    onChange={(event) =>
                      onChange({
                        ...draft,
                        priceMax: Math.min(
                          SEARCH_PRICE_BOUNDS.max,
                          Number(event.target.value) || SEARCH_PRICE_BOUNDS.max,
                        ),
                      })
                    }
                    className="w-full rounded-xl border border-line bg-white/80 px-3 py-2.5 text-sm text-ink outline-none focus:border-accent/40"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showApply ? (
        <button
          type="button"
          className="btn-primary mt-4 w-full"
          onClick={onApply}
        >
          {t("apply", { count: applyCount ?? 0 })}
        </button>
      ) : null}
    </div>
  );
}
