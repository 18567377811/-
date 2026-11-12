"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useRegion } from "@/components/layout/RegionProvider";
import { CloseIcon } from "./HeaderIcons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RegionPicker({ open, onClose }: Props) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { regions, region, setRegionId } = useRegion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer border-0 bg-black/50 backdrop-blur-[1px]"
        aria-label={t("close")}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-picker-title"
        className="relative z-10 flex max-h-[min(82vh,560px)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-[#fffdf9] shadow-[0_24px_60px_rgba(43,33,28,0.22)] sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-center justify-center border-b border-line/80 px-12 py-4">
          <h2
            id="region-picker-title"
            className="font-display text-lg tracking-tight text-[#2f4a52] sm:text-xl"
          >
            {t("countryTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/60"
            aria-label={t("close")}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto overscroll-contain px-3 py-2">
          {regions.map((item) => {
            const active = item.id === region.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-[#f3e4d8]"
                      : "bg-transparent hover:bg-[#f7efe6]/80"
                  }`}
                  onClick={() => {
                    setRegionId(item.id);
                    onClose();
                    if (item.locale !== locale) {
                      router.replace(pathname, {
                        locale: item.locale as AppLocale,
                      });
                    }
                  }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efe4d8] text-[11px] font-semibold tracking-wide text-ink">
                    {item.code}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] leading-snug text-[#5c6b70]">
                    <span className="block truncate">{item.label}</span>
                    <span className="mt-0.5 block text-[12px] text-[#8a7b72]">
                      {item.currencySymbol} · {item.currencyCode} · ×
                      {item.exchangeRate}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
