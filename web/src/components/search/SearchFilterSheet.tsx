"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/layout/HeaderIcons";
import type { SearchFilters } from "@/lib/search";
import { SearchFilterPanel } from "./SearchFilterPanel";

type Props = {
  open: boolean;
  onClose: () => void;
  draft: SearchFilters;
  onChange: (next: SearchFilters) => void;
  openSort: boolean;
  openPrice: boolean;
  onToggleSort: () => void;
  onTogglePrice: () => void;
  applyCount: number;
  onApply: () => void;
};

export function SearchFilterSheet({
  open,
  onClose,
  draft,
  onChange,
  openSort,
  openPrice,
  onToggleSort,
  onTogglePrice,
  applyCount,
  onApply,
}: Props) {
  const t = useTranslations("search");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={t("closeFilters")}
        className={`absolute inset-0 border-0 bg-black/45 backdrop-blur-[1px] transition-opacity duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("filters")}
        className={`relative z-10 flex max-h-[min(86vh,640px)] w-full max-w-md flex-col rounded-t-[1.75rem] bg-[#fffdf9] shadow-[0_24px_60px_rgba(43,33,28,0.22)] transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.75rem] ${
          open
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
          <h2 className="font-display text-xl text-ink">{t("filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)]"
            aria-label={t("closeFilters")}
          >
            <CloseIcon className="h-[1.1rem] w-[1.1rem]" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-2">
          <SearchFilterPanel
            draft={draft}
            onChange={onChange}
            openSort={openSort}
            openPrice={openPrice}
            onToggleSort={onToggleSort}
            onTogglePrice={onTogglePrice}
            showApply
            applyCount={applyCount}
            onApply={onApply}
          />
        </div>
      </div>
    </div>
  );
}
