export function formatUsd(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
