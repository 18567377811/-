export const STYLE_OPTIONS = [
  {
    value: "realistic",
    zh: "写实还原",
    en: "Realistic likeness",
    ms: "Realistik",
  },
  {
    value: "soft",
    zh: "柔和温馨",
    en: "Soft & cozy",
    ms: "Lembut & selesa",
  },
  {
    value: "stylized",
    zh: "艺术风格化",
    en: "Stylized / artistic",
    ms: "Stail artistik",
  },
  {
    value: "mini",
    zh: "迷你摆件感",
    en: "Mini keepsake",
    ms: "Cenderamata mini",
  },
  {
    value: "artist",
    zh: "交给艺术家建议",
    en: "Artist’s recommendation",
    ms: "Cadangan artis",
  },
] as const;

export const TIMING_OPTIONS = [
  {
    value: "asap",
    zh: "尽快开始",
    en: "As soon as possible",
    ms: "Secepat mungkin",
  },
  {
    value: "1-3",
    zh: "1–3 个月内",
    en: "Within 1–3 months",
    ms: "Dalam 1–3 bulan",
  },
  {
    value: "3-6",
    zh: "3–6 个月",
    en: "Within 3–6 months",
    ms: "Dalam 3–6 bulan",
  },
  {
    value: "6-12",
    zh: "6–12 个月（可排队）",
    en: "6–12 months (waitlist ok)",
    ms: "6–12 bulan (boleh menunggu)",
  },
  {
    value: "flexible",
    zh: "时间灵活",
    en: "Timeline is flexible",
    ms: "Jadual fleksibel",
  },
] as const;

export const COMMISSION_STATUSES = [
  { value: "new", label: "新申请" },
  { value: "contacted", label: "已联系" },
  { value: "discussing", label: "沟通中" },
  { value: "accepted", label: "已接受" },
  { value: "declined", label: "已婉拒" },
  { value: "archived", label: "已归档" },
] as const;

export function labelForOption(
  options: ReadonlyArray<{
    value: string;
    zh: string;
    en: string;
    ms: string;
  }>,
  value: string,
  locale: string,
): string {
  const hit = options.find((item) => item.value === value);
  if (!hit) return value || "—";
  if (locale === "zh") return hit.zh;
  if (locale === "ms") return hit.ms;
  return hit.en;
}
