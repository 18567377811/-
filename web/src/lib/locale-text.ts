import type { AppLocale } from "@/i18n/routing";

type LocalizedFields = {
  zh: string;
  en: string;
  ms: string;
};

export function pickLocale(
  locale: string | undefined,
  fields: LocalizedFields,
): string {
  const key = (locale === "zh" || locale === "ms" || locale === "en"
    ? locale
    : "en") as AppLocale;
  return fields[key] || fields.en || fields.zh || fields.ms;
}

export function parseKeywords(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}
