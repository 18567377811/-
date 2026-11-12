"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconTrash,
} from "@/components/admin/icons";
import { adminToast } from "@/components/admin/toast";
import {
  EmptyState,
  Field,
  ImageField,
  ListCard,
  LocaleFields,
  Section,
  Sheet,
  Thumb,
  Toggle,
} from "@/components/admin/ui";
import {
  syncLocaleTriples,
  triple,
  type LocaleTriple,
} from "@/lib/admin-locale-sync";

type Slide = {
  id: string;
  image: string;
  titleZh: string;
  titleEn: string;
  titleMs: string;
  bodyZh: string;
  bodyEn: string;
  bodyMs: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = () => ({
  image: "",
  titleZh: "",
  titleEn: "",
  titleMs: "",
  bodyZh: "",
  bodyEn: "",
  bodyMs: "",
  sortOrder: 0,
  isActive: true,
});

type FormState = ReturnType<typeof emptyForm>;
type LocaleBaseline = {
  title: LocaleTriple;
  body: LocaleTriple;
};

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [localeBaseline, setLocaleBaseline] = useState<LocaleBaseline | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function snapshotLocales(state: FormState): LocaleBaseline {
    return {
      title: triple(state.titleZh, state.titleEn, state.titleMs),
      body: triple(state.bodyZh, state.bodyEn, state.bodyMs),
    };
  }

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/hero-slides");
    if (!res.ok) return;
    const data = (await res.json()) as { slides: Slide[] };
    setSlides(data.slides);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    const next = emptyForm();
    setEditingId(null);
    setForm(next);
    setLocaleBaseline(null);
    setError(null);
    setOpen(true);
  }

  function openEdit(slide: Slide) {
    const next: FormState = {
      image: slide.image,
      titleZh: slide.titleZh,
      titleEn: slide.titleEn,
      titleMs: slide.titleMs,
      bodyZh: slide.bodyZh,
      bodyEn: slide.bodyEn,
      bodyMs: slide.bodyMs,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    };
    setEditingId(slide.id);
    setForm(next);
    setLocaleBaseline(snapshotLocales(next));
    setError(null);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      adminToast.info("正在按中文自动翻译 EN/MS…");
      const synced = await syncLocaleTriples([
        {
          id: "title",
          current: triple(form.titleZh, form.titleEn, form.titleMs),
          baseline: localeBaseline?.title,
        },
        {
          id: "body",
          current: triple(form.bodyZh, form.bodyEn, form.bodyMs),
          baseline: localeBaseline?.body,
        },
      ]);
      const nextForm: FormState = {
        ...form,
        titleZh: synced.title.zh,
        titleEn: synced.title.en,
        titleMs: synced.title.ms,
        bodyZh: synced.body.zh,
        bodyEn: synced.body.en,
        bodyMs: synced.body.ms,
      };
      setForm(nextForm);

      const res = await fetch(
        editingId
          ? `/api/admin/hero-slides/${editingId}`
          : "/api/admin/hero-slides",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextForm),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "保存失败");
      setOpen(false);
      adminToast.success(editingId ? "轮播已更新" : "轮播已创建");
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存失败";
      setError(message);
      adminToast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("确定删除该轮播？")) return;
    const res = await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      adminToast.error(data.error || "删除失败");
      return;
    }
    adminToast.success("轮播已删除");
    await load();
  }

  async function move(id: string, direction: -1 | 1) {
    const index = slides.findIndex((item) => item.id === id);
    const swap = slides[index + direction];
    if (!swap) return;
    await Promise.all([
      fetch(`/api/admin/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swap.sortOrder }),
      }),
      fetch(`/api/admin/hero-slides/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: slides[index].sortOrder }),
      }),
    ]);
    adminToast.success("排序已更新");
    await load();
  }

  return (
    <AdminShell
      title="首页轮播"
      action={
        <button
          type="button"
          className="admin-icon-btn admin-icon-btn-primary"
          aria-label="新建"
          onClick={openCreate}
        >
          <IconPlus className="h-5 w-5" />
        </button>
      }
    >
      {slides.length === 0 ? (
        <EmptyState text="还没有轮播图。" />
      ) : (
        <ListCard>
          {slides.map((slide, index) => (
            <div key={slide.id} className="admin-row">
              <Thumb src={slide.image} alt={slide.titleZh} />
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => openEdit(slide)}
              >
                <p className="truncate text-[15px] font-semibold">
                  {slide.titleZh}
                </p>
                <p className="mt-0.5 truncate text-xs text-[var(--ios-secondary)]">
                  {slide.isActive ? "启用" : "停用"} · {slide.titleEn}
                </p>
              </button>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="上移"
                  disabled={index === 0}
                  onClick={() => move(slide.id, -1)}
                >
                  <IconChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="下移"
                  disabled={index === slides.length - 1}
                  onClick={() => move(slide.id, 1)}
                >
                  <IconChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  aria-label="删除"
                  onClick={() => remove(slide.id)}
                >
                  <IconTrash className="h-[1.05rem] w-[1.05rem]" />
                </button>
              </div>
            </div>
          ))}
        </ListCard>
      )}

      <Sheet
        open={open}
        title={editingId ? "编辑轮播" : "新建轮播"}
        onClose={() => setOpen(false)}
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-primary w-full py-3"
            disabled={saving}
            onClick={save}
          >
            {saving ? "保存中…" : "保存"}
          </button>
        }
      >
        <Section title="图片">
          <ImageField
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
        </Section>
        <Section title="文案">
          <Field label="标题">
            <LocaleFields
              values={{
                zh: form.titleZh,
                en: form.titleEn,
                ms: form.titleMs,
              }}
              onChange={(title) =>
                setForm({
                  ...form,
                  titleZh: title.zh,
                  titleEn: title.en,
                  titleMs: title.ms,
                })
              }
            />
          </Field>
          <Field label="正文">
            <LocaleFields
              multiline
              values={{ zh: form.bodyZh, en: form.bodyEn, ms: form.bodyMs }}
              onChange={(body) =>
                setForm({
                  ...form,
                  bodyZh: body.zh,
                  bodyEn: body.en,
                  bodyMs: body.ms,
                })
              }
            />
          </Field>
        </Section>
        <Toggle
          label="启用"
          on={form.isActive}
          onChange={(isActive) => setForm({ ...form, isActive })}
        />
        {error ? <p className="text-sm text-[var(--ios-red)]">{error}</p> : null}
      </Sheet>
    </AdminShell>
  );
}
