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
  Select,
  Sheet,
  Thumb,
  Toggle,
} from "@/components/admin/ui";

type Category = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  nameMs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionMs: string;
  hintZh: string;
  hintEn: string;
  hintMs: string;
  coverImage: string;
  displayMode: "featured" | "grid";
  showOnHome: boolean;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

const emptyForm = (): Omit<Category, "id" | "_count"> => ({
  slug: "",
  nameZh: "",
  nameEn: "",
  nameMs: "",
  descriptionZh: "",
  descriptionEn: "",
  descriptionMs: "",
  hintZh: "",
  hintEn: "",
  hintMs: "",
  coverImage: "",
  displayMode: "grid",
  showOnHome: true,
  sortOrder: 0,
  isActive: true,
});

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    if (!res.ok) return;
    const data = (await res.json()) as { categories: Category[] };
    setCategories(data.categories);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditingId(category.id);
    const { id: _id, _count, ...rest } = category;
    setForm(rest);
    setError(null);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        editingId
          ? `/api/admin/categories/${editingId}`
          : "/api/admin/categories",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "保存失败");
      setOpen(false);
      adminToast.success(editingId ? "分类已更新" : "分类已创建");
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
    if (!window.confirm("确定删除该分类？")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      adminToast.error(data.error || "删除失败");
      return;
    }
    adminToast.success("分类已删除");
    await load();
  }

  async function move(id: string, direction: -1 | 1) {
    const index = categories.findIndex((item) => item.id === id);
    const swap = categories[index + direction];
    if (!swap) return;
    await Promise.all([
      fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swap.sortOrder }),
      }),
      fetch(`/api/admin/categories/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: categories[index].sortOrder }),
      }),
    ]);
    adminToast.success("排序已更新");
    await load();
  }

  return (
    <AdminShell
      title="分类"
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
      {categories.length === 0 ? (
        <EmptyState text="还没有分类，点右上角新建。" />
      ) : (
        <ListCard>
          {categories.map((category, index) => (
            <div key={category.id} className="admin-row">
              <Thumb src={category.coverImage} alt={category.nameZh} />
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => openEdit(category)}
              >
                <p className="truncate text-[15px] font-semibold">
                  {category.nameZh}
                </p>
                <p className="mt-0.5 text-xs text-[var(--ios-secondary)]">
                  {category.displayMode === "featured" ? "大图" : "双列"} ·{" "}
                  {category.showOnHome ? "首页展示" : "仅分类页"} ·{" "}
                  {category._count?.products ?? 0} 件
                </p>
              </button>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="上移"
                  disabled={index === 0}
                  onClick={() => move(category.id, -1)}
                >
                  <IconChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="下移"
                  disabled={index === categories.length - 1}
                  onClick={() => move(category.id, 1)}
                >
                  <IconChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn-danger"
                  aria-label="删除"
                  onClick={() => remove(category.id)}
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
        title={editingId ? "编辑分类" : "新建分类"}
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
        <Section title="基本信息">
          <Field label="短链标识">
            <input
              className="admin-input"
              value={form.slug}
              placeholder="如 portrait"
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="名称">
            <LocaleFields
              values={{ zh: form.nameZh, en: form.nameEn, ms: form.nameMs }}
              onChange={(name) =>
                setForm({
                  ...form,
                  nameZh: name.zh,
                  nameEn: name.en,
                  nameMs: name.ms,
                })
              }
            />
          </Field>
          <Field label="简介">
            <LocaleFields
              multiline
              values={{
                zh: form.descriptionZh,
                en: form.descriptionEn,
                ms: form.descriptionMs,
              }}
              onChange={(description) =>
                setForm({
                  ...form,
                  descriptionZh: description.zh,
                  descriptionEn: description.en,
                  descriptionMs: description.ms,
                })
              }
            />
          </Field>
          <Field label="首页提示">
            <LocaleFields
              values={{ zh: form.hintZh, en: form.hintEn, ms: form.hintMs }}
              onChange={(hint) =>
                setForm({
                  ...form,
                  hintZh: hint.zh,
                  hintEn: hint.en,
                  hintMs: hint.ms,
                })
              }
            />
          </Field>
        </Section>
        <Section title="封面图">
          <ImageField
            value={form.coverImage}
            onChange={(coverImage) => setForm({ ...form, coverImage })}
          />
        </Section>
        <Section title="展示">
          <Field label="展示模式">
            <Select
              value={form.displayMode}
              onChange={(displayMode) =>
                setForm({
                  ...form,
                  displayMode: displayMode as "featured" | "grid",
                })
              }
              options={[
                { value: "featured", label: "大图展示" },
                { value: "grid", label: "双列展示" },
              ]}
            />
          </Field>
        </Section>
        <Toggle
          label="首页展示"
          on={form.showOnHome}
          onChange={(showOnHome) => setForm({ ...form, showOnHome })}
        />
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
