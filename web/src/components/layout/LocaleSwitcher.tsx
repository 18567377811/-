"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
      <span className="sr-only">{t("label")}</span>
      <select
        className="max-w-[7.5rem] truncate rounded-full border border-line bg-white px-2.5 py-1.5 text-xs outline-none sm:max-w-none sm:px-3 sm:text-sm"
        value={locale}
        onChange={(event) => {
          router.replace(pathname, {
            locale: event.target.value as AppLocale,
          });
        }}
        aria-label={t("label")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </select>
    </label>
  );
}
