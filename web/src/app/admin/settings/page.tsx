"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { IconPlus, IconTrash } from "@/components/admin/icons";
import {
  Field,
  ImageField,
  LocaleFields,
  Section,
  Toggle,
} from "@/components/admin/ui";
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

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) return;
    const data = (await res.json()) as { config: Record<string, string> };
    const c = data.config;
    setForm({
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
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "保存失败");
      setMessage("已保存");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
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
        <Section title="品牌">
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

        <Section title="政策页（富文本）">
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

        <Section title="拍照指南">
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
            <div key={index} className="rounded-xl bg-[var(--ios-fill-soft)] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--ios-secondary)]">
                  提示 {index + 1}
                </p>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      photoGuideTips: form.photoGuideTips.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
              <LocaleFields
                multiline
                values={tip}
                onChange={(v) => {
                  const photoGuideTips = [...form.photoGuideTips];
                  photoGuideTips[index] = v;
                  setForm({ ...form, photoGuideTips });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() =>
              setForm({
                ...form,
                photoGuideTips: [...form.photoGuideTips, emptyTip()],
              })
            }
          >
            <IconPlus className="h-4 w-4" />
            添加提示
          </button>
        </Section>

        <Section title="一起把性格做活（下单步骤）">
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
            <div key={index} className="space-y-2 rounded-xl bg-[var(--ios-fill-soft)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--ios-secondary)]">
                  步骤 {index + 1}
                </p>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      processSteps: form.processSteps.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
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
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() =>
              setForm({
                ...form,
                processSteps: [...form.processSteps, emptyStep()],
              })
            }
          >
            <IconPlus className="h-4 w-4" />
            添加步骤
          </button>
        </Section>

        <Section title="常见问题">
          {form.faq.map((item, index) => (
            <div key={index} className="space-y-2 rounded-xl bg-[var(--ios-fill-soft)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--ios-secondary)]">
                  FAQ {index + 1}
                </p>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      faq: form.faq.filter((_, i) => i !== index),
                    })
                  }
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
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
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() =>
              setForm({ ...form, faq: [...form.faq, emptyFaq()] })
            }
          >
            <IconPlus className="h-4 w-4" />
            添加 FAQ
          </button>
        </Section>

        <Section title="页脚社交媒体">
          {form.social.map((item, index) => (
            <div key={item.id} className="space-y-2 rounded-xl bg-[var(--ios-fill-soft)] p-3">
              <p className="text-sm font-semibold">{item.label}</p>
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
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="定制感谢页（中英并列）">
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
            <div
              key={index}
              className="space-y-2 rounded-xl bg-[var(--ios-fill-soft)] p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--ios-secondary)]">
                  步骤 {index + 1}
                </p>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      thanks: {
                        ...form.thanks,
                        steps: form.thanks.steps.filter((_, i) => i !== index),
                      },
                    })
                  }
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
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
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary w-full"
            onClick={() =>
              setForm({
                ...form,
                thanks: {
                  ...form.thanks,
                  steps: [
                    ...form.thanks.steps,
                    { zh: "", en: "", ms: "" },
                  ],
                },
              })
            }
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
            onClick={() =>
              setForm({ ...form, thanks: { ...DEFAULT_THANKS } })
            }
          >
            恢复默认感谢页文案
          </button>
        </Section>

        {message ? (
          <p className="text-center text-sm text-[var(--ios-blue)]">{message}</p>
        ) : null}
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
