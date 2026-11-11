"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { IconPlus, IconTrash } from "@/components/admin/icons";
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

type CategoryOption = { id: string; nameZh: string; slug: string };
type Variant = {
  id?: string;
  labelZh: string;
  labelEn: string;
  labelMs: string;
  priceUsd: number;
  sortOrder: number;
};
type Product = {
  id: string;
  slug: string;
  categoryId: string;
  saleType: "direct" | "custom";
  nameZh: string;
  nameEn: string;
  nameMs: string;
  summaryZh: string;
  summaryEn: string;
  summaryMs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionMs: string;
  priceFromUsd: number;
  turnaroundMonths: string;
  rating: number | null;
  image: string;
  inStock: boolean;
  keywords: string;
  sortOrder: number;
  isActive: boolean;
  variants: Variant[];
  category?: CategoryOption;
};

function emptyVariant(): Variant {
  return { labelZh: "", labelEn: "", labelMs: "", priceUsd: 0, sortOrder: 0 };
}

function emptyForm(categoryId = "") {
  return {
    slug: "",
    categoryId,
    saleType: "custom" as "direct" | "custom",
    nameZh: "",
    nameEn: "",
    nameMs: "",
    summaryZh: "",
    summaryEn: "",
    summaryMs: "",
    descriptionZh: "",
    descriptionEn: "",
    descriptionMs: "",
    priceFromUsd: 0,
    turnaroundMonths: "3–8",
    rating: null as number | null,
    image: "",
    inStock: true,
    keywords: "",
    sortOrder: 0,
    isActive: true,
    variants: [emptyVariant()],
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    if (pRes.ok) {
      const data = (await pRes.json()) as { products: Product[] };
      setProducts(data.products);
    }
    if (cRes.ok) {
      const data = (await cRes.json()) as { categories: CategoryOption[] };
      setCategories(data.categories);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm(categories[0]?.id ?? ""));
    setError(null);
    setOpen(true);
  }

  function openEdit(product: Product) {
    let keywords = "";
    try {
      keywords = (JSON.parse(product.keywords || "[]") as string[]).join(", ");
    } catch {
      keywords = "";
    }
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      categoryId: product.categoryId,
      saleType: product.saleType || "custom",
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      nameMs: product.nameMs,
      summaryZh: product.summaryZh,
      summaryEn: product.summaryEn,
      summaryMs: product.summaryMs,
      descriptionZh: product.descriptionZh,
      descriptionEn: product.descriptionEn,
      descriptionMs: product.descriptionMs,
      priceFromUsd: product.priceFromUsd,
      turnaroundMonths: product.turnaroundMonths,
      rating: product.rating,
      image: product.image,
      inStock: product.inStock,
      keywords,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
      variants: product.variants.map((variant, index) => ({
        id: variant.id,
        labelZh: variant.labelZh,
        labelEn: variant.labelEn,
        labelMs: variant.labelMs,
        priceUsd: variant.priceUsd,
        sortOrder: variant.sortOrder ?? index,
      })),
    });
    setError(null);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const keywords = form.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const payload = {
        ...form,
        keywords,
        priceFromUsd:
          form.priceFromUsd ||
          Math.min(...form.variants.map((v) => Number(v.priceUsd) || 0)),
        rating:
          form.rating == null || Number.isNaN(form.rating) ? null : form.rating,
      };
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "保存失败");
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("确定删除该商品？")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      window.alert(data.error || "删除失败");
      return;
    }
    await load();
  }

  return (
    <AdminShell
      title="商品"
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
      {products.length === 0 ? (
        <EmptyState text="还没有商品，点右上角新建。" />
      ) : (
        <ListCard>
          {products.map((product) => (
            <div key={product.id} className="admin-row">
              <Thumb src={product.image} alt={product.nameZh} />
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => openEdit(product)}
              >
                <p className="truncate text-[15px] font-semibold">
                  {product.nameZh}
                </p>
                <p className="mt-0.5 text-xs text-[var(--ios-secondary)]">
                  {product.saleType === "direct" ? "直售" : "定制"} ·{" "}
                  {product.category?.nameZh ?? "未分类"} · $
                  {product.priceFromUsd}
                </p>
              </button>
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger"
                aria-label="删除"
                onClick={() => remove(product.id)}
              >
                <IconTrash className="h-[1.05rem] w-[1.05rem]" />
              </button>
            </div>
          ))}
        </ListCard>
      )}

      <Sheet
        open={open}
        title={editingId ? "编辑商品" : "新建商品"}
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
        <Section title="归属与类型">
          <Field label="绑定分类">
            <Select
              value={form.categoryId}
              onChange={(categoryId) => setForm({ ...form, categoryId })}
              options={[
                { value: "", label: "选择分类" },
                ...categories.map((category) => ({
                  value: category.id,
                  label: `${category.nameZh} (${category.slug})`,
                })),
              ]}
            />
          </Field>
          <Field label="销售类型">
            <Select
              value={form.saleType}
              onChange={(saleType) =>
                setForm({
                  ...form,
                  saleType: saleType as "direct" | "custom",
                })
              }
              options={[
                { value: "custom", label: "定制商品（先填委托表单）" },
                { value: "direct", label: "直售商品（购物车结算）" },
              ]}
            />
          </Field>
          <Field label="短链标识">
            <input
              className="admin-input"
              value={form.slug}
              placeholder="如 framed-pet-portrait-dog"
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
        </Section>

        <Section title="文案">
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
          <Field label="摘要">
            <LocaleFields
              multiline
              values={{
                zh: form.summaryZh,
                en: form.summaryEn,
                ms: form.summaryMs,
              }}
              onChange={(summary) =>
                setForm({
                  ...form,
                  summaryZh: summary.zh,
                  summaryEn: summary.en,
                  summaryMs: summary.ms,
                })
              }
            />
          </Field>
          <Field label="详情（富文本）">
            <LocaleFields
              rich
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
        </Section>

        <Section title="主图">
          <ImageField
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
        </Section>

        <Section title="价格与工期">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="起价 USD">
              <input
                type="number"
                className="admin-input"
                value={form.priceFromUsd}
                onChange={(e) =>
                  setForm({ ...form, priceFromUsd: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="工期（月）">
              <input
                className="admin-input"
                value={form.turnaroundMonths}
                onChange={(e) =>
                  setForm({ ...form, turnaroundMonths: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="关键词（逗号分隔）">
            <input
              className="admin-input"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </Field>
        </Section>

        <Toggle
          label="有货"
          on={form.inStock}
          onChange={(inStock) => setForm({ ...form, inStock })}
        />
        <Toggle
          label="上架"
          on={form.isActive}
          onChange={(isActive) => setForm({ ...form, isActive })}
        />

        <Section title="规格变体">
          <div className="space-y-3">
            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="space-y-2 rounded-xl bg-[var(--ios-fill-soft)] p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--ios-secondary)]">
                    规格 {index + 1}
                  </p>
                  {form.variants.length > 1 ? (
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn-danger"
                      aria-label="移除规格"
                      onClick={() =>
                        setForm({
                          ...form,
                          variants: form.variants.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <LocaleFields
                  values={{
                    zh: variant.labelZh,
                    en: variant.labelEn,
                    ms: variant.labelMs,
                  }}
                  onChange={(label) => {
                    const variants = [...form.variants];
                    variants[index] = {
                      ...variant,
                      labelZh: label.zh,
                      labelEn: label.en,
                      labelMs: label.ms,
                    };
                    setForm({ ...form, variants });
                  }}
                />
                <Field label="价格 USD">
                  <input
                    type="number"
                    className="admin-input"
                    value={variant.priceUsd}
                    onChange={(e) => {
                      const variants = [...form.variants];
                      variants[index] = {
                        ...variant,
                        priceUsd: Number(e.target.value),
                      };
                      setForm({ ...form, variants });
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
                  variants: [...form.variants, emptyVariant()],
                })
              }
            >
              <IconPlus className="h-4 w-4" />
              添加规格
            </button>
          </div>
        </Section>
        {error ? <p className="text-sm text-[var(--ios-red)]">{error}</p> : null}
      </Sheet>
    </AdminShell>
  );
}
