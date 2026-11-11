export type ThanksStep = { zh: string; en: string; ms: string };

export type ThanksContent = {
  titleZh: string;
  titleEn: string;
  titleMs: string;
  bodyZh: string;
  bodyEn: string;
  bodyMs: string;
  nextZh: string;
  nextEn: string;
  nextMs: string;
  steps: ThanksStep[];
  noteZh: string;
  noteEn: string;
  noteMs: string;
  ctaZh: string;
  ctaEn: string;
  ctaMs: string;
};

export const DEFAULT_THANKS: ThanksContent = {
  titleZh: "感谢你的 Forever Home 委托申请",
  titleEn: "Thank you for your Forever Home request",
  titleMs: "Terima kasih atas permohonan Forever Home anda",
  bodyZh:
    "我们已收到你的定制委托。这是一份重要的决定，我们会认真、温柔地对待每一次申请。",
  bodyEn:
    "We’ve received your commission request and will hold it with care. Nothing is charged until you’re comfortable with the plan.",
  bodyMs:
    "Kami telah menerima permintaan komisen anda dan akan menjaganya dengan teliti.",
  nextZh: "接下来会发生什么",
  nextEn: "What happens next",
  nextMs: "Apa seterusnya",
  steps: [
    {
      zh: "我们会审阅你的需求、风格偏好、时间安排与宠物照片。",
      en: "Our artist reviews your brief, style, timeline, and photos.",
      ms: "Kami semak ringkasan, gaya, masa dan foto anda.",
    },
    {
      zh: "通常在 24 小时内通过邮件联系你，一起讨论方案与细节。",
      en: "We’ll email within 24 hours to talk through ideas together.",
      ms: "Kami e-mel dalam 24 jam untuk bincang idea bersama.",
    },
    {
      zh: "在你认可方案之前，不会开始制作，也不会产生任何费用。",
      en: "Nothing is created or charged until you approve the plan.",
      ms: "Tiada ciptaan atau caj sehingga anda selesa dengan rancangan.",
    },
  ],
  noteZh: "请留意收件箱，并检查垃圾邮件 / 促销邮件文件夹。",
  noteEn: "Please check your inbox — and spam / promotions folders.",
  noteMs: "Sila semak peti masuk dan folder spam.",
  ctaZh: "继续浏览作品",
  ctaEn: "Explore our pieces",
  ctaMs: "Terokai koleksi",
};

export function parseThanksContent(raw: string | null | undefined): ThanksContent {
  if (!raw || raw === "{}") return DEFAULT_THANKS;
  try {
    const parsed = JSON.parse(raw) as Partial<ThanksContent>;
    return {
      ...DEFAULT_THANKS,
      ...parsed,
      steps:
        Array.isArray(parsed.steps) && parsed.steps.length > 0
          ? parsed.steps.map((step) => ({
              zh: step?.zh ?? "",
              en: step?.en ?? "",
              ms: step?.ms ?? "",
            }))
          : DEFAULT_THANKS.steps,
    };
  } catch {
    return DEFAULT_THANKS;
  }
}

export function pickThanksPair(
  locale: string,
  content: ThanksContent,
): {
  title: string;
  titleAlt: string;
  body: string;
  bodyAlt: string;
  next: string;
  nextAlt: string;
  steps: Array<{ primary: string; secondary: string }>;
  note: string;
  noteAlt: string;
  cta: string;
} {
  const isZh = locale === "zh";
  const isMs = locale === "ms";
  return {
    title: isZh ? content.titleZh : isMs ? content.titleMs : content.titleEn,
    titleAlt: isZh ? content.titleEn : content.titleZh,
    body: isZh ? content.bodyZh : isMs ? content.bodyMs : content.bodyEn,
    bodyAlt: isZh ? content.bodyEn : content.bodyZh,
    next: isZh ? content.nextZh : isMs ? content.nextMs : content.nextEn,
    nextAlt: isZh ? content.nextEn : content.nextZh,
    steps: content.steps.map((step) => ({
      primary: isZh ? step.zh : isMs ? step.ms : step.en,
      secondary: isZh ? step.en : step.zh,
    })),
    note: isZh ? content.noteZh : isMs ? content.noteMs : content.noteEn,
    noteAlt: isZh ? content.noteEn : content.noteZh,
    cta: isZh ? content.ctaZh : isMs ? content.ctaMs : content.ctaEn,
  };
}
