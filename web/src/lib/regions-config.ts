import type { AppLocale } from "@/i18n/routing";

/** 后台可配置的销售地区（语言 + 货币 + 汇率） */
export type RegionConfig = {
  id: string;
  /** 列表徽章短码，如 CN / US / MY */
  code: string;
  /** 展示名称 */
  label: string;
  /** 站点语言路由 */
  locale: AppLocale;
  /**
   * 翻译接口目标语言参数（MyMemory / Google 等）
   * 例：zh-CN、en、ms
   */
  translateLang: string;
  /** ISO 货币码，用于展示 */
  currencyCode: string;
  /** 货币符号：¥ / $ / RM */
  currencySymbol: string;
  /**
   * 相对商品基准价（USD）的汇率：
   * 展示价 = 商品价(USD) × exchangeRate
   */
  exchangeRate: number;
  enabled?: boolean;
};

export const TRANSLATE_LANG_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "zh-CN", label: "中文 zh-CN" },
  { value: "en", label: "英语 en" },
  { value: "ms", label: "马来语 ms" },
  { value: "en-GB", label: "英语（英）en-GB" },
  { value: "zh-TW", label: "繁中 zh-TW" },
];

export const LOCALE_OPTIONS: Array<{ value: AppLocale; label: string }> = [
  { value: "zh", label: "中文 zh" },
  { value: "en", label: "英语 en" },
  { value: "ms", label: "马来语 ms" },
];

/** 默认三区：中文 ¥、英语 $、马来 RM */
export const DEFAULT_REGIONS: RegionConfig[] = [
  {
    id: "cn",
    code: "CN",
    label: "中国（CNY ¥）",
    locale: "zh",
    translateLang: "zh-CN",
    currencyCode: "CNY",
    currencySymbol: "¥",
    exchangeRate: 7.2,
    enabled: true,
  },
  {
    id: "us",
    code: "US",
    label: "English / United States (USD $)",
    locale: "en",
    translateLang: "en",
    currencyCode: "USD",
    currencySymbol: "$",
    exchangeRate: 1,
    enabled: true,
  },
  {
    id: "my",
    code: "MY",
    label: "Malaysia (MYR RM)",
    locale: "ms",
    translateLang: "ms",
    currencyCode: "MYR",
    currencySymbol: "RM",
    exchangeRate: 4.7,
    enabled: true,
  },
];

export const REGION_STORAGE_KEY = "feltora-region";

export function parseRegionsJson(raw: string | null | undefined): RegionConfig[] {
  if (!raw) return DEFAULT_REGIONS.map((r) => ({ ...r }));
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_REGIONS.map((r) => ({ ...r }));
    }
    const regions: RegionConfig[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const locale = row.locale === "zh" || row.locale === "ms" ? row.locale : "en";
      const rate = Number(row.exchangeRate);
      regions.push({
        id: String(row.id || "").trim() || `r-${regions.length}`,
        code: String(row.code || "").trim().toUpperCase().slice(0, 4) || "XX",
        label: String(row.label || "").trim() || "Region",
        locale,
        translateLang: String(row.translateLang || locale).trim() || locale,
        currencyCode: String(row.currencyCode || "USD").trim().toUpperCase(),
        currencySymbol: String(row.currencySymbol || "$").trim() || "$",
        exchangeRate: Number.isFinite(rate) && rate > 0 ? rate : 1,
        enabled: row.enabled !== false,
      });
    }
    return regions.length > 0 ? regions : DEFAULT_REGIONS.map((r) => ({ ...r }));
  } catch {
    return DEFAULT_REGIONS.map((r) => ({ ...r }));
  }
}

export function enabledRegions(regions: RegionConfig[]): RegionConfig[] {
  return regions.filter((r) => r.enabled !== false);
}

export function defaultRegionIdForLocale(
  locale: string,
  regions: RegionConfig[] = DEFAULT_REGIONS,
): string {
  const list = enabledRegions(regions);
  const match = list.find((r) => r.locale === locale);
  return match?.id ?? list[0]?.id ?? "us";
}

export function findRegion(
  id: string | null | undefined,
  regions: RegionConfig[],
): RegionConfig {
  const list = enabledRegions(regions);
  return list.find((r) => r.id === id) ?? list[0] ?? DEFAULT_REGIONS[1];
}
