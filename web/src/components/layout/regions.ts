import type { AppLocale } from "@/i18n/routing";

export type RegionOption = {
  id: string;
  /** Short code for cream badge (Windows-safe, no flag emoji) */
  code: string;
  label: string;
  locale: AppLocale;
};

export const REGION_STORAGE_KEY = "feltora-region";

/** Country / region list; maps to site locales */
export const REGION_OPTIONS: RegionOption[] = [
  { id: "ar", code: "AR", label: "Argentina (USD $)", locale: "en" },
  { id: "au", code: "AU", label: "Australia (AUD $)", locale: "en" },
  { id: "ca", code: "CA", label: "Canada (CAD $)", locale: "en" },
  { id: "cn", code: "CN", label: "China (CNY ¥)", locale: "zh" },
  { id: "hk", code: "HK", label: "Hong Kong SAR (HKD $)", locale: "zh" },
  { id: "id", code: "ID", label: "Indonesia (IDR Rp)", locale: "en" },
  { id: "jp", code: "JP", label: "Japan (JPY ¥)", locale: "en" },
  { id: "my", code: "MY", label: "Malaysia (MYR RM)", locale: "ms" },
  { id: "nz", code: "NZ", label: "New Zealand (NZD $)", locale: "en" },
  { id: "ph", code: "PH", label: "Philippines (PHP ₱)", locale: "en" },
  { id: "sg", code: "SG", label: "Singapore (SGD $)", locale: "en" },
  { id: "tw", code: "TW", label: "Taiwan (TWD $)", locale: "zh" },
  { id: "th", code: "TH", label: "Thailand (THB ฿)", locale: "en" },
  { id: "gb", code: "GB", label: "United Kingdom (GBP £)", locale: "en" },
  { id: "us", code: "US", label: "United States (USD $)", locale: "en" },
];

export function defaultRegionIdForLocale(locale: string): string {
  if (locale === "zh") return "cn";
  if (locale === "ms") return "my";
  return "us";
}
