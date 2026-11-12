import { prisma } from "@/lib/db";
import { pickLocale } from "@/lib/locale-text";
import {
  DEFAULT_REGIONS,
  enabledRegions,
  parseRegionsJson,
} from "@/lib/regions-config";
import {
  DEFAULT_THANKS,
  parseThanksContent,
  pickThanksPair,
} from "@/lib/thanks-content";

export type LocalizedTip = { zh: string; en: string; ms: string };
export type ProcessStep = {
  titleZh: string;
  titleEn: string;
  titleMs: string;
  bodyZh: string;
  bodyEn: string;
  bodyMs: string;
};
export type FaqItem = {
  qZh: string;
  qEn: string;
  qMs: string;
  aZh: string;
  aEn: string;
  aMs: string;
};
export type SocialLink = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
};

const DEFAULT_TIPS: LocalizedTip[] = [
  {
    zh: "使用自然光，避免重度滤镜。",
    en: "Use natural light and avoid heavy filters.",
    ms: "Gunakan cahaya semula jadi, elak penapis berat.",
  },
  {
    zh: "提供一张清晰的正面脸部照片。",
    en: "Share a clear front-facing photo.",
    ms: "Sediakan foto wajah depan yang jelas.",
  },
  {
    zh: "补充侧面，方便还原耳朵、吻部与体态。",
    en: "Add a side view for ears, muzzle, and posture.",
    ms: "Tambah sisi untuk telinga, muncung dan sikap.",
  },
  {
    zh: "用多张照片展示真实毛色。",
    en: "Use several photos to show true coat colors.",
    ms: "Guna beberapa foto untuk warna bulu sebenar.",
  },
  {
    zh: "简单写一点性格，有助于把握表情。",
    en: "A short note about personality helps expression.",
    ms: "Catatan singkat tentang personaliti membantu ekspresi.",
  },
];

const DEFAULT_STEPS: ProcessStep[] = [
  {
    titleZh: "提交照片",
    titleEn: "Share photos",
    titleMs: "Hantar foto",
    bodyZh: "付款后请上传清晰照片与一段宠物故事。我们会一起挑选最佳参考图。",
    bodyEn: "After payment, upload clear photos and a short pet story.",
    bodyMs: "Selepas bayaran, muat naik foto jelas dan cerita ringkas.",
  },
  {
    titleZh: "羊毛骨架",
    titleEn: "Wool structure",
    titleMs: "Struktur bulu",
    bodyZh: "先做出稳固的羊毛基底，保证比例与表情准确。",
    bodyEn: "We build a stable wool base for accurate proportions.",
    bodyMs: "Kami bina asas bulu yang kukuh untuk proporsi tepat.",
  },
  {
    titleZh: "眼睛、鼻子与毛色",
    titleEn: "Eyes, nose & coat",
    titleMs: "Mata, hidung & bulu",
    bodyZh: "手绘眼睛、塑形五官，再一根根混色植毛，做出层次与真实感。",
    bodyEn: "Hand-finished features and layered fiber color matching.",
    bodyMs: "Ciri tangan siap dan warna bulu berlapis.",
  },
  {
    titleZh: "预览与确认",
    titleEn: "Preview & approve",
    titleMs: "Pratonton & sahkan",
    bodyZh: "发货前会发送预览。欢迎提出小幅调整。",
    bodyEn: "We send a preview before shipping for small adjustments.",
    bodyMs: "Kami hantar pratonton sebelum penghantaran.",
  },
];

const DEFAULT_FAQ: FaqItem[] = [
  {
    qZh: "可以寄到海外吗？",
    qEn: "Do you ship internationally?",
    qMs: "Adakah anda hantar ke luar negara?",
    aZh: "可以，我们支持全球配送；完成后通常再需 2–4 周物流时间。",
    aEn: "Yes — worldwide shipping, usually 2–4 weeks after completion.",
    aMs: "Ya — penghantaran global, biasanya 2–4 minggu selepas siap.",
  },
  {
    qZh: "订单大概多久完成？",
    qEn: "How long does an order take?",
    qMs: "Berapa lama tempoh siap?",
    aZh: "手工定制通常需要 3–10 个月，视作品类型而定。",
    aEn: "Handmade commissions usually take 3–10 months.",
    aMs: "Komisen handmade biasanya 3–10 bulan.",
  },
  {
    qZh: "Feltora 作品如何制作？",
    qEn: "How are Feltora pieces made?",
    qMs: "Bagaimana Feltora dibuat?",
    aZh: "每件作品都用天然羊毛针毡手工完成。",
    aEn: "Each piece is needle-felted by hand with natural wool.",
    aMs: "Setiap karya dibuat tangan dengan bulu semula jadi.",
  },
  {
    qZh: "如何保证我满意？",
    qEn: "How do you ensure I’m happy?",
    qMs: "Bagaimana pastikan saya berpuas hati?",
    aZh: "制作过程中会发送进度照片与最终预览，并沟通微调。",
    aEn: "We share progress photos and a final preview for tweaks.",
    aMs: "Kami kongsi foto kemajuan dan pratonton akhir.",
  },
];

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: "facebook", label: "Facebook", href: "", enabled: true },
  { id: "instagram", label: "Instagram", href: "", enabled: true },
  { id: "youtube", label: "YouTube", href: "", enabled: true },
  { id: "tiktok", label: "TikTok", href: "", enabled: true },
];

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function ensureSiteConfig() {
  return prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: "Feltora",
      themeAccent: "#9a5b45",
      photoGuideIntroZh:
        "清晰的照片能帮助我们更准确地还原。尽量提供多个角度。",
      photoGuideIntroEn:
        "Clear photos help us recreate your pet accurately. Share several angles when you can.",
      photoGuideIntroMs:
        "Foto yang jelas membantu kami mencipta semula haiwan anda dengan tepat.",
      processBodyZh:
        "每一件 Feltora 作品都是协作：照片、手工、预览，再仔细收尾。",
      processBodyEn:
        "Every Feltora piece is a collaboration: photos, craft, preview, then careful finishing.",
      processBodyMs:
        "Setiap karya Feltora adalah kolaborasi: foto, kraftangan, pratonton, dan penamat teliti.",
      photoGuideTipsJson: JSON.stringify(DEFAULT_TIPS),
      processStepsJson: JSON.stringify(DEFAULT_STEPS),
      faqJson: JSON.stringify(DEFAULT_FAQ),
      socialJson: JSON.stringify(DEFAULT_SOCIAL),
      thanksJson: JSON.stringify(DEFAULT_THANKS),
      regionsJson: JSON.stringify(DEFAULT_REGIONS),
      policyRefundEn:
        "<p>Refund requests are reviewed case by case for custom commissions.</p>",
      policyRefundZh: "<p>定制商品退款将按个案审核处理。</p>",
      policyRefundMs: "<p>Bayaran balik komisen dinilai mengikut kes.</p>",
      policyShippingEn:
        "<p>Worldwide shipping after completion, typically 2–4 weeks in transit.</p>",
      policyShippingZh: "<p>完成后全球配送，物流通常 2–4 周。</p>",
      policyShippingMs:
        "<p>Penghantaran global selepas siap, biasanya 2–4 minggu.</p>",
      policyTermsEn:
        "<p>By placing an order you agree to handmade lead times and preview-based revisions.</p>",
      policyTermsZh: "<p>下单即表示理解手工工期，并以预览沟通微调。</p>",
      policyTermsMs:
        "<p>Dengan membuat pesanan, anda bersetuju tempoh handmade dan semakan pratonton.</p>",
      policyCareEn:
        "<p>Keep dry, avoid crushing, and dust gently with a soft brush.</p>",
      policyCareZh: "<p>保持干燥，避免挤压，可用软刷轻轻除尘。</p>",
      policyCareMs:
        "<p>Pastikan kering, elak ditekan, dan bersihkan lembut dengan berus lembut.</p>",
    },
  });
}

export async function getSiteConfig() {
  return ensureSiteConfig();
}

export async function getLocalizedSiteContent(locale: string) {
  const config = await ensureSiteConfig();
  const tips = parseJson<LocalizedTip[]>(config.photoGuideTipsJson, DEFAULT_TIPS);
  const steps = parseJson<ProcessStep[]>(config.processStepsJson, DEFAULT_STEPS);
  const faq = parseJson<FaqItem[]>(config.faqJson, DEFAULT_FAQ);
  const social = parseJson<SocialLink[]>(config.socialJson, DEFAULT_SOCIAL).filter(
    (item) => item.enabled !== false,
  );
  const regionsRaw = parseRegionsJson(
    (config as { regionsJson?: string }).regionsJson,
  );
  const regions = enabledRegions(
    regionsRaw.length ? regionsRaw : DEFAULT_REGIONS,
  );

  return {
    config,
    logoUrl: config.logoUrl,
    siteTitle: config.siteTitle,
    themeAccent: config.themeAccent,
    regions,
    photoGuide: {
      title: pickLocale(locale, {
        zh: config.photoGuideTitleZh,
        en: config.photoGuideTitleEn,
        ms: config.photoGuideTitleMs,
      }),
      intro: pickLocale(locale, {
        zh: config.photoGuideIntroZh,
        en: config.photoGuideIntroEn,
        ms: config.photoGuideIntroMs,
      }),
      tips: tips.map((tip) =>
        pickLocale(locale, { zh: tip.zh, en: tip.en, ms: tip.ms }),
      ),
    },
    process: {
      title: pickLocale(locale, {
        zh: config.processTitleZh,
        en: config.processTitleEn,
        ms: config.processTitleMs,
      }),
      body: pickLocale(locale, {
        zh: config.processBodyZh,
        en: config.processBodyEn,
        ms: config.processBodyMs,
      }),
      steps: steps.map((step) => ({
        title: pickLocale(locale, {
          zh: step.titleZh,
          en: step.titleEn,
          ms: step.titleMs,
        }),
        body: pickLocale(locale, {
          zh: step.bodyZh,
          en: step.bodyEn,
          ms: step.bodyMs,
        }),
      })),
    },
    faq: faq.map((item) => ({
      q: pickLocale(locale, { zh: item.qZh, en: item.qEn, ms: item.qMs }),
      a: pickLocale(locale, { zh: item.aZh, en: item.aEn, ms: item.aMs }),
    })),
    social,
    thanks: pickThanksPair(locale, parseThanksContent(config.thanksJson)),
    policies: {
      refund: pickLocale(locale, {
        zh: config.policyRefundZh,
        en: config.policyRefundEn,
        ms: config.policyRefundMs,
      }),
      shipping: pickLocale(locale, {
        zh: config.policyShippingZh,
        en: config.policyShippingEn,
        ms: config.policyShippingMs,
      }),
      terms: pickLocale(locale, {
        zh: config.policyTermsZh,
        en: config.policyTermsEn,
        ms: config.policyTermsMs,
      }),
      care: pickLocale(locale, {
        zh: config.policyCareZh,
        en: config.policyCareEn,
        ms: config.policyCareMs,
      }),
    },
  };
}
