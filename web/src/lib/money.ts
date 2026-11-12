import type { RegionConfig } from "@/lib/regions-config";
import { DEFAULT_REGIONS } from "@/lib/regions-config";

/** 基准价（商品录入的 USD）→ 当前地区展示金额 */
export function convertFromUsd(amountUsd: number, region: RegionConfig): number {
  const rate = region.exchangeRate > 0 ? region.exchangeRate : 1;
  return amountUsd * rate;
}

export function formatMoney(amountUsd: number, region: RegionConfig): string {
  const local = convertFromUsd(amountUsd, region);
  const fraction =
    region.currencyCode === "JPY" || region.currencyCode === "KRW" ? 0 : 2;
  // 整数汇率场景（如展示习惯）仍尽量干净：接近整数时少小数
  const rounded =
    Math.abs(local - Math.round(local)) < 0.005
      ? Math.round(local)
      : Number(local.toFixed(fraction));

  try {
    return new Intl.NumberFormat(
      region.locale === "zh" ? "zh-CN" : region.locale === "ms" ? "ms-MY" : "en-US",
      {
        style: "currency",
        currency: region.currencyCode,
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: fraction,
        minimumFractionDigits: Number.isInteger(rounded) ? 0 : Math.min(2, fraction),
      },
    ).format(rounded);
  } catch {
    const symbol = region.currencySymbol || region.currencyCode;
    const num = Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(2);
    return `${symbol}${num}`;
  }
}

/** @deprecated 请优先用 useRegion().formatPrice；无地区上下文时默认按 USD */
export function formatUsd(amount: number, locale: string) {
  const region =
    DEFAULT_REGIONS.find((r) => r.locale === locale) ?? DEFAULT_REGIONS[1];
  return formatMoney(amount, region);
}
