"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { IconPlus, IconTrash } from "@/components/admin/icons";
import { adminToast } from "@/components/admin/toast";
import {
  Field,
  ImageField,
  ItemCard,
  LocaleFields,
  Section,
  Toggle,
} from "@/components/admin/ui";
import {
  syncLocaleTriples,
  triple,
  type LocaleSyncItem,
} from "@/lib/admin-locale-sync";
import {
  DEFAULT_THANKS,
  parseThanksContent,
  type ThanksContent,
} from "@/lib/thanks-content";

type Tip = { zh: string; en: string; ms: string };
type Step = {
  titleZh: string;
  titleEn: string;
  titleMs: string;
  bodyZh: string;
  bodyEn: string;
  bodyMs: string;
};
type Faq = {
  qZh: string;
  qEn: string;
  qMs: string;
  aZh: string;
  aEn: string;
  aMs: string;
};
type Social = { id: string; label: string; href: string; enabled: boolean };

type FormState = {
  logoUrl: string;
  siteTitle: string;
  themeAccent: string;
  policyRefundZh: string;
  policyRefundEn: string;
  policyRefundMs: string;
  policyShippingZh: string;
  policyShippingEn: string;
  policyShippingMs: string;
  policyTermsZh: string;
  policyTermsEn: string;
  policyTermsMs: string;
  policyCareZh: string;
  policyCareEn: string;
  policyCareMs: string;
  photoGuideTitleZh: string;
  photoGuideTitleEn: string;
  photoGuideTitleMs: string;
  photoGuideIntroZh: string;
  photoGuideIntroEn: string;
  photoGuideIntroMs: string;
  photoGuideTips: Tip[];
  processTitleZh: string;
  processTitleEn: string;
  processTitleMs: string;
  processBodyZh: string;
  processBodyEn: string;
  processBodyMs: string;
  processSteps: Step[];
  faq: Faq[];
  social: Social[];
  thanks: ThanksContent;
};

const emptyTip = (): Tip => ({ zh: "", en: "", ms: "" });
const emptyStep = (): Step => ({
  titleZh: "",
  titleEn: "",
  titleMs: "",
  bodyZh: "",
  bodyEn: "",
  bodyMs: "",
});
const emptyFaq = (): Faq => ({
  qZh: "",
  qEn: "",
  qMs: "",
  aZh: "",
  aEn: "",
  aMs: "",
});

function buildSettingsSyncItems(
  current: FormState,
  baseline: FormState | null,
): LocaleSyncItem[] {
  const items: LocaleSyncItem[] = [
    {
      id: "policyRefund",
      current: triple(
        current.policyRefundZh,
        current.policyRefundEn,
        current.policyRefundMs,
      ),
      baseline: baseline
        ? triple(
            baseline.policyRefundZh,
            baseline.policyRefundEn,
            baseline.policyRefundMs,
          )
        : null,
      html: true,
    },
    {
      id: "policyShipping",
      current: triple(
        current.policyShippingZh,
        current.policyShippingEn,
        current.policyShippingMs,
      ),
      baseline: baseline
        ? triple(
            baseline.policyShippingZh,
            baseline.policyShippingEn,
            baseline.policyShippingMs,
          )
        : null,
      html: true,
    },
    {
      id: "policyTerms",
      current: triple(
        current.policyTermsZh,
        current.policyTermsEn,
        current.policyTermsMs,
      ),
      baseline: baseline
        ? triple(
            baseline.policyTermsZh,
            baseline.policyTermsEn,
            baseline.policyTermsMs,
          )
        : null,
      html: true,
    },
    {
      id: "policyCare",
      current: triple(
        current.policyCareZh,
        current.policyCareEn,
        current.policyCareMs,
      ),
      baseline: baseline
        ? triple(
            baseline.policyCareZh,
            baseline.policyCareEn,
            baseline.policyCareMs,
          )
        : null,
      html: true,
    },
    {
      id: "photoGuideTitle",
      current: triple(
        current.photoGuideTitleZh,
        current.photoGuideTitleEn,
        current.photoGuideTitleMs,
      ),
      baseline: baseline
        ? triple(
            baseline.photoGuideTitleZh,
            baseline.photoGuideTitleEn,
            baseline.photoGuideTitleMs,
          )
        : null,
    },
    {
      id: "photoGuideIntro",
      current: triple(
        current.photoGuideIntroZh,
        current.photoGuideIntroEn,
        current.photoGuideIntroMs,
      ),
      baseline: baseline
        ? triple(
            baseline.photoGuideIntroZh,
            baseline.photoGuideIntroEn,
            baseline.photoGuideIntroMs,
          )
        : null,
    },
    {
      id: "processTitle",
      current: triple(
        current.processTitleZh,
        current.processTitleEn,
        current.processTitleMs,
      ),
      baseline: baseline
        ? triple(
            baseline.processTitleZh,
            baseline.processTitleEn,
            baseline.processTitleMs,
          )
        : null,
    },
    {
      id: "processBody",
      current: triple(
        current.processBodyZh,
        current.processBodyEn,
        current.processBodyMs,
      ),
      baseline: baseline
        ? triple(
            baseline.processBodyZh,
            baseline.processBodyEn,
            baseline.processBodyMs,
          )
        : null,
    },
    {
      id: "thanksTitle",
      current: triple(
        current.thanks.titleZh,
        current.thanks.titleEn,
        current.thanks.titleMs,
      ),
      baseline: baseline
        ? triple(
            baseline.thanks.titleZh,
            baseline.thanks.titleEn,
            baseline.thanks.titleMs,
          )
        : null,
    },
    {
      id: "thanksBody",
      current: triple(
        current.thanks.bodyZh,
        current.thanks.bodyEn,
        current.thanks.bodyMs,
      ),
      baseline: baseline
        ? triple(
            baseline.thanks.bodyZh,
            baseline.thanks.bodyEn,
            baseline.thanks.bodyMs,
          )
        : null,
    },
    {
      id: "thanksNext",
      current: triple(
        current.thanks.nextZh,
        current.thanks.nextEn,
        current.thanks.nextMs,
      ),
      baseline: baseline
        ? triple(
            baseline.thanks.nextZh,
            baseline.thanks.nextEn,
            baseline.thanks.nextMs,
          )
        : null,
    },
    {
      id: "thanksNote",
      current: triple(
        current.thanks.noteZh,
        current.thanks.noteEn,
        current.thanks.noteMs,
      ),
      baseline: baseline
        ? triple(
            baseline.thanks.noteZh,
            baseline.thanks.noteEn,
            baseline.thanks.noteMs,
          )
        : null,
    },
    {
      id: "thanksCta",
      current: triple(
        current.thanks.ctaZh,
        current.thanks.ctaEn,
        current.thanks.ctaMs,
      ),
      baseline: baseline
        ? triple(
            baseline.thanks.ctaZh,
            baseline.thanks.ctaEn,
            baseline.thanks.ctaMs,
          )
        : null,
    },
  ];

  current.photoGuideTips.forEach((tip, index) => {
    items.push({
      id: `tip-${index}`,
      current: triple(tip.zh, tip.en, tip.ms),
      baseline: baseline?.photoGuideTips[index]
        ? triple(
            baseline.photoGuideTips[index].zh,
            baseline.photoGuideTips[index].en,
            baseline.photoGuideTips[index].ms,
          )
        : null,
    });
  });

  current.processSteps.forEach((step, index) => {
    items.push(
      {
        id: `step-title-${index}`,
        current: triple(step.titleZh, step.titleEn, step.titleMs),
        baseline: baseline?.processSteps[index]
          ? triple(
              baseline.processSteps[index].titleZh,
              baseline.processSteps[index].titleEn,
              baseline.processSteps[index].titleMs,
            )
          : null,
      },
      {
        id: `step-body-${index}`,
        current: triple(step.bodyZh, step.bodyEn, step.bodyMs),
        baseline: baseline?.processSteps[index]
          ? triple(
              baseline.processSteps[index].bodyZh,
              baseline.processSteps[index].bodyEn,
              baseline.processSteps[index].bodyMs,
            )
          : null,
      },
    );
  });

  current.faq.forEach((item, index) => {
    items.push(
      {
        id: `faq-q-${index}`,
        current: triple(item.qZh, item.qEn, item.qMs),
        baseline: baseline?.faq[index]
          ? triple(
              baseline.faq[index].qZh,
              baseline.faq[index].qEn,
              baseline.faq[index].qMs,
            )
          : null,
      },
      {
        id: `faq-a-${index}`,
        current: triple(item.aZh, item.aEn, item.aMs),
        baseline: baseline?.faq[index]
          ? triple(
              baseline.faq[index].aZh,
              baseline.faq[index].aEn,
              baseline.faq[index].aMs,
            )
          : null,
      },
    );
  });

  current.thanks.steps.forEach((step, index) => {
    items.push({
      id: `thanks-step-${index}`,
      current: triple(step.zh, step.en, step.ms),
      baseline: baseline?.thanks.steps[index]
        ? triple(
            baseline.thanks.steps[index].zh,
            baseline.thanks.steps[index].en,
            baseline.thanks.steps[index].ms,
          )
        : null,
    });
  });

  return items;
}

function applySettingsSync(
  form: FormState,
  synced: Record<string, { zh: string; en: string; ms: string }>,
): FormState {
  return {
    ...form,
    policyRefundZh: synced.policyRefund.zh,
    policyRefundEn: synced.policyRefund.en,
    policyRefundMs: synced.policyRefund.ms,
    policyShippingZh: synced.policyShipping.zh,
    policyShippingEn: synced.policyShipping.en,
    policyShippingMs: synced.policyShipping.ms,
    policyTermsZh: synced.policyTerms.zh,
    policyTermsEn: synced.policyTerms.en,
    policyTermsMs: synced.policyTerms.ms,
    policyCareZh: synced.policyCare.zh,
    policyCareEn: synced.policyCare.en,
    policyCareMs: synced.policyCare.ms,
    photoGuideTitleZh: synced.photoGuideTitle.zh,
    photoGuideTitleEn: synced.photoGuideTitle.en,
    photoGuideTitleMs: synced.photoGuideTitle.ms,
    photoGuideIntroZh: synced.photoGuideIntro.zh,
    photoGuideIntroEn: synced.photoGuideIntro.en,
    photoGuideIntroMs: synced.photoGuideIntro.ms,
    processTitleZh: synced.processTitle.zh,
    processTitleEn: synced.processTitle.en,
    processTitleMs: synced.processTitle.ms,
    processBodyZh: synced.processBody.zh,
    processBodyEn: synced.processBody.en,
    processBodyMs: synced.processBody.ms,
    photoGuideTips: form.photoGuideTips.map((tip, index) => {
      const next = synced[`tip-${index}`];
      return next ? { zh: next.zh, en: next.en, ms: next.ms } : tip;
    }),
    processSteps: form.processSteps.map((step, index) => {
      const title = synced[`step-title-${index}`];
      const body = synced[`step-body-${index}`];
      return {
        titleZh: title?.zh ?? step.titleZh,
        titleEn: title?.en ?? step.titleEn,
        titleMs: title?.ms ?? step.titleMs,
        bodyZh: body?.zh ?? step.bodyZh,
        bodyEn: body?.en ?? step.bodyEn,
        bodyMs: body?.ms ?? step.bodyMs,
      };
    }),
    faq: form.faq.map((item, index) => {
      const q = synced[`faq-q-${index}`];
      const a = synced[`faq-a-${index}`];
      return {
        qZh: q?.zh ?? item.qZh,
        qEn: q?.en ?? item.qEn,
        qMs: q?.ms ?? item.qMs,
        aZh: a?.zh ?? item.aZh,
        aEn: a?.en ?? item.aEn,
        aMs: a?.ms ?? item.aMs,
      };
    }),
    thanks: {
      ...form.thanks,
      titleZh: synced.thanksTitle.zh,
      titleEn: synced.thanksTitle.en,
      titleMs: synced.thanksTitle.ms,
      bodyZh: synced.thanksBody.zh,
      bodyEn: synced.thanksBody.en,
      bodyMs: synced.thanksBody.ms,
      nextZh: synced.thanksNext.zh,
      nextEn: synced.thanksNext.en,
      nextMs: synced.thanksNext.ms,
      noteZh: synced.thanksNote.zh,
      noteEn: synced.thanksNote.en,
      noteMs: synced.thanksNote.ms,
      ctaZh: synced.thanksCta.zh,
      ctaEn: synced.thanksCta.en,
      ctaMs: synced.thanksCta.ms,
      steps: form.thanks.steps.map((step, index) => {
        const next = synced[`thanks-step-${index}`];
        return next ? { zh: next.zh, en: next.en, ms: next.ms } : step;
      }),
    },
  };
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const baselineRef = useRef<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) return;
    const data = (await res.json()) as { config: Record<string, string> };
    const c = data.config;
    const next: FormState = {
      logoUrl: c.logoUrl || "",
      siteTitle: c.siteTitle || "Feltora",
      themeAccent: c.themeAccent || "#9a5b45",
      policyRefundZh: c.policyRefundZh || "",
      policyRefundEn: c.policyRefundEn || "",
      policyRefundMs: c.policyRefundMs || "",
      policyShippingZh: c.policyShippingZh || "",
      policyShippingEn: c.policyShippingEn || "",
      policyShippingMs: c.policyShippingMs || "",
      policyTermsZh: c.policyTermsZh || "",
      policyTermsEn: c.policyTermsEn || "",
      policyTermsMs: c.policyTermsMs || "",
      policyCareZh: c.policyCareZh || "",
      policyCareEn: c.policyCareEn || "",
      policyCareMs: c.policyCareMs || "",
      photoGuideTitleZh: c.photoGuideTitleZh || "",
      photoGuideTitleEn: c.photoGuideTitleEn || "",
      photoGuideTitleMs: c.photoGuideTitleMs || "",
      photoGuideIntroZh: c.photoGuideIntroZh || "",
      photoGuideIntroEn: c.photoGuideIntroEn || "",
      photoGuideIntroMs: c.photoGuideIntroMs || "",
      photoGuideTips: JSON.parse(c.photoGuideTipsJson || "[]") as Tip[],
      processTitleZh: c.processTitleZh || "",
      processTitleEn: c.processTitleEn || "",
      processTitleMs: c.processTitleMs || "",
      processBodyZh: c.processBodyZh || "",
      processBodyEn: c.processBodyEn || "",
      processBodyMs: c.processBodyMs || "",
      processSteps: JSON.parse(c.processStepsJson || "[]") as Step[],
      faq: JSON.parse(c.faqJson || "[]") as Faq[],
      social: JSON.parse(c.socialJson || "[]") as Social[],
      thanks: parseThanksContent(c.thanksJson),
    };
    baselineRef.current = structuredClone(next);
    setForm(next);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      adminToast.info("正在按中文自动翻译 EN/MS…");
      const synced = await syncLocaleTriples(
        buildSettingsSyncItems(form, baselineRef.current),
      );
      const nextForm = applySettingsSync(form, synced);
      setForm(nextForm);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextForm),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "保存失败");
      baselineRef.current = structuredClone(nextForm);
      adminToast.success("配置已保存");
    } catch (error) {
      adminToast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return (
      <AdminShell title="系统配置">
        <p className="text-[var(--ios-secondary)]">加载中…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="系统配置"
      action={
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          disabled={saving}
          onClick={save}
        >
          {saving ? "保存中…" : "保存全部"}
        </button>
      }
    >
      <div className="space-y-4">
        <Section title="品牌" collapsible defaultOpen={false}>
          <Field label="网站标题">
            <input
              className="admin-input"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
            />
          </Field>
          <Field label="主题色">
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="h-11 w-14 cursor-pointer rounded-xl border-0 bg-transparent"
                value={form.themeAccent}
                onChange={(e) =>
                  setForm({ ...form, themeAccent: e.target.value })
                }
              />
              <input
                className="admin-input"
                value={form.themeAccent}
                onChange={(e) =>
                  setForm({ ...form, themeAccent: e.target.value })
                }
              />
            </div>
          </Field>
          <Field label="Logo">
            <ImageField
              value={form.logoUrl}
              onChange={(logoUrl) => setForm({ ...form, logoUrl })}
            />
          </Field>
        </Section>

        <Section title="政策页（富文本）" collapsible defaultOpen={false}>
          <Field label="退款政策">
            <LocaleFields
              rich
              values={{
                zh: form.policyRefundZh,
                en: form.policyRefundEn,
                ms: form.policyRefundMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  policyRefundZh: v.zh,
                  policyRefundEn: v.en,
                  policyRefundMs: v.ms,
                })
              }
            />
          </Field>
          <Field label="物流政策">
            <LocaleFields
              rich
              values={{
                zh: form.policyShippingZh,
                en: form.policyShippingEn,
                ms: form.policyShippingMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  policyShippingZh: v.zh,
                  policyShippingEn: v.en,
                  policyShippingMs: v.ms,
                })
              }
            />
          </Field>
          <Field label="服务条款">
            <LocaleFields
              rich
              values={{
                zh: form.policyTermsZh,
                en: form.policyTermsEn,
                ms: form.policyTermsMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  policyTermsZh: v.zh,
                  policyTermsEn: v.en,
                  policyTermsMs: v.ms,
                })
              }
            />
          </Field>
          <Field label="护理说明">
            <LocaleFields
              rich
              values={{
                zh: form.policyCareZh,
                en: form.policyCareEn,
                ms: form.policyCareMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  policyCareZh: v.zh,
                  policyCareEn: v.en,
                  policyCareMs: v.ms,
                })
              }
            />
          </Field>
        </Section>

        <Section title="拍照指南" collapsible defaultOpen={false}>
          <Field label="标题">
            <LocaleFields
              values={{
                zh: form.photoGuideTitleZh,
                en: form.photoGuideTitleEn,
                ms: form.photoGuideTitleMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  photoGuideTitleZh: v.zh,
                  photoGuideTitleEn: v.en,
                  photoGuideTitleMs: v.ms,
                })
              }
            />
          </Field>
          <Field label="描述">
            <LocaleFields
              multiline
              values={{
                zh: form.photoGuideIntroZh,
                en: form.photoGuideIntroEn,
                ms: form.photoGuideIntroMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  photoGuideIntroZh: v.zh,
                  photoGuideIntroEn: v.en,
                  photoGuideIntroMs: v.ms,
                })
              }
            />
          </Field>
          {form.photoGuideTips.map((tip, index) => (
            <ItemCard
              key={index}
              title={`提示 ${index + 1}`}
              action={
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() => {
                    setForm({
                      ...form,
                      photoGuideTips: form.photoGuideTips.filter(
                        (_, i) => i !== index,
                      ),
                    });
                    adminToast.info("已移除提示");
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              }
            >
              <Field label="提示内容">
                <LocaleFields
                  multiline
                  values={tip}
                  onChange={(v) => {
                    const photoGuideTips = [...form.photoGuideTips];
                    photoGuideTips[index] = v;
                    setForm({ ...form, photoGuideTips });
                  }}
                />
              </Field>
            </ItemCard>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() => {
              setForm({
                ...form,
                photoGuideTips: [...form.photoGuideTips, emptyTip()],
              });
              adminToast.success("已添加提示");
            }}
          >
            <IconPlus className="h-4 w-4" />
            添加提示
          </button>
        </Section>

        <Section title="一起把性格做活（下单步骤）" collapsible defaultOpen={false}>
          <Field label="标题">
            <LocaleFields
              values={{
                zh: form.processTitleZh,
                en: form.processTitleEn,
                ms: form.processTitleMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  processTitleZh: v.zh,
                  processTitleEn: v.en,
                  processTitleMs: v.ms,
                })
              }
            />
          </Field>
          <Field label="描述">
            <LocaleFields
              multiline
              values={{
                zh: form.processBodyZh,
                en: form.processBodyEn,
                ms: form.processBodyMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  processBodyZh: v.zh,
                  processBodyEn: v.en,
                  processBodyMs: v.ms,
                })
              }
            />
          </Field>
          {form.processSteps.map((step, index) => (
            <ItemCard
              key={index}
              title={`步骤 ${index + 1}`}
              action={
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() => {
                    setForm({
                      ...form,
                      processSteps: form.processSteps.filter(
                        (_, i) => i !== index,
                      ),
                    });
                    adminToast.info("已移除步骤");
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              }
            >
              <Field label="步骤标题">
                <LocaleFields
                  values={{
                    zh: step.titleZh,
                    en: step.titleEn,
                    ms: step.titleMs,
                  }}
                  onChange={(v) => {
                    const processSteps = [...form.processSteps];
                    processSteps[index] = {
                      ...step,
                      titleZh: v.zh,
                      titleEn: v.en,
                      titleMs: v.ms,
                    };
                    setForm({ ...form, processSteps });
                  }}
                />
              </Field>
              <Field label="步骤说明">
                <LocaleFields
                  multiline
                  values={{
                    zh: step.bodyZh,
                    en: step.bodyEn,
                    ms: step.bodyMs,
                  }}
                  onChange={(v) => {
                    const processSteps = [...form.processSteps];
                    processSteps[index] = {
                      ...step,
                      bodyZh: v.zh,
                      bodyEn: v.en,
                      bodyMs: v.ms,
                    };
                    setForm({ ...form, processSteps });
                  }}
                />
              </Field>
            </ItemCard>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() => {
              setForm({
                ...form,
                processSteps: [...form.processSteps, emptyStep()],
              });
              adminToast.success("已添加步骤");
            }}
          >
            <IconPlus className="h-4 w-4" />
            添加步骤
          </button>
        </Section>

        <Section title="常见问题" collapsible defaultOpen={false}>
          {form.faq.map((item, index) => (
            <ItemCard
              key={index}
              title={`FAQ ${index + 1}`}
              action={
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() => {
                    setForm({
                      ...form,
                      faq: form.faq.filter((_, i) => i !== index),
                    });
                    adminToast.info("已移除 FAQ");
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              }
            >
              <Field label="问题">
                <LocaleFields
                  values={{ zh: item.qZh, en: item.qEn, ms: item.qMs }}
                  onChange={(v) => {
                    const faq = [...form.faq];
                    faq[index] = {
                      ...item,
                      qZh: v.zh,
                      qEn: v.en,
                      qMs: v.ms,
                    };
                    setForm({ ...form, faq });
                  }}
                />
              </Field>
              <Field label="回答">
                <LocaleFields
                  multiline
                  values={{ zh: item.aZh, en: item.aEn, ms: item.aMs }}
                  onChange={(v) => {
                    const faq = [...form.faq];
                    faq[index] = {
                      ...item,
                      aZh: v.zh,
                      aEn: v.en,
                      aMs: v.ms,
                    };
                    setForm({ ...form, faq });
                  }}
                />
              </Field>
            </ItemCard>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() => {
              setForm({ ...form, faq: [...form.faq, emptyFaq()] });
              adminToast.success("已添加 FAQ");
            }}
          >
            <IconPlus className="h-4 w-4" />
            添加 FAQ
          </button>
        </Section>

        <Section title="页脚社交媒体" collapsible defaultOpen={false}>
          {form.social.map((item, index) => (
            <ItemCard key={item.id} title={item.label}>
              <Field label="跳转链接">
                <input
                  className="admin-input"
                  value={item.href}
                  placeholder="https://"
                  onChange={(e) => {
                    const social = [...form.social];
                    social[index] = { ...item, href: e.target.value };
                    setForm({ ...form, social });
                  }}
                />
              </Field>
              <Toggle
                label="显示"
                on={item.enabled}
                onChange={(enabled) => {
                  const social = [...form.social];
                  social[index] = { ...item, enabled };
                  setForm({ ...form, social });
                  adminToast.success(enabled ? `已开启 ${item.label}` : `已关闭 ${item.label}`);
                }}
              />
            </ItemCard>
          ))}
        </Section>

        <Section title="定制感谢页（中英并列）" collapsible defaultOpen={false}>
          <Field label="主标题">
            <LocaleFields
              values={{
                zh: form.thanks.titleZh,
                en: form.thanks.titleEn,
                ms: form.thanks.titleMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  thanks: {
                    ...form.thanks,
                    titleZh: v.zh,
                    titleEn: v.en,
                    titleMs: v.ms,
                  },
                })
              }
            />
          </Field>
          <Field label="说明文案">
            <LocaleFields
              multiline
              values={{
                zh: form.thanks.bodyZh,
                en: form.thanks.bodyEn,
                ms: form.thanks.bodyMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  thanks: {
                    ...form.thanks,
                    bodyZh: v.zh,
                    bodyEn: v.en,
                    bodyMs: v.ms,
                  },
                })
              }
            />
          </Field>
          <Field label="「接下来」标题">
            <LocaleFields
              values={{
                zh: form.thanks.nextZh,
                en: form.thanks.nextEn,
                ms: form.thanks.nextMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  thanks: {
                    ...form.thanks,
                    nextZh: v.zh,
                    nextEn: v.en,
                    nextMs: v.ms,
                  },
                })
              }
            />
          </Field>
          {form.thanks.steps.map((step, index) => (
            <ItemCard
              key={index}
              title={`步骤 ${index + 1}`}
              action={
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() => {
                    setForm({
                      ...form,
                      thanks: {
                        ...form.thanks,
                        steps: form.thanks.steps.filter((_, i) => i !== index),
                      },
                    });
                    adminToast.info("已移除步骤");
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              }
            >
              <Field label="步骤文案">
                <LocaleFields
                  multiline
                  values={{ zh: step.zh, en: step.en, ms: step.ms }}
                  onChange={(v) => {
                    const steps = [...form.thanks.steps];
                    steps[index] = { zh: v.zh, en: v.en, ms: v.ms };
                    setForm({
                      ...form,
                      thanks: { ...form.thanks, steps },
                    });
                  }}
                />
              </Field>
            </ItemCard>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() => {
              setForm({
                ...form,
                thanks: {
                  ...form.thanks,
                  steps: [
                    ...form.thanks.steps,
                    { zh: "", en: "", ms: "" },
                  ],
                },
              });
              adminToast.success("已添加感谢页步骤");
            }}
          >
            <IconPlus className="h-4 w-4" />
            添加感谢页步骤
          </button>
          <Field label="底部提示">
            <LocaleFields
              multiline
              values={{
                zh: form.thanks.noteZh,
                en: form.thanks.noteEn,
                ms: form.thanks.noteMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  thanks: {
                    ...form.thanks,
                    noteZh: v.zh,
                    noteEn: v.en,
                    noteMs: v.ms,
                  },
                })
              }
            />
          </Field>
          <Field label="按钮文案">
            <LocaleFields
              values={{
                zh: form.thanks.ctaZh,
                en: form.thanks.ctaEn,
                ms: form.thanks.ctaMs,
              }}
              onChange={(v) =>
                setForm({
                  ...form,
                  thanks: {
                    ...form.thanks,
                    ctaZh: v.zh,
                    ctaEn: v.en,
                    ctaMs: v.ms,
                  },
                })
              }
            />
          </Field>
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() => {
              setForm({ ...form, thanks: { ...DEFAULT_THANKS } });
              adminToast.success("已恢复默认感谢页文案");
            }}
          >
            恢复默认感谢页文案
          </button>
        </Section>

        <button
          type="button"
          className="admin-btn admin-btn-primary w-full py-3"
          disabled={saving}
          onClick={save}
        >
          {saving ? "保存中…" : "保存全部配置"}
        </button>
      </div>
    </AdminShell>
  );
}
