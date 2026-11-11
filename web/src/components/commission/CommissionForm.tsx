"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  STYLE_OPTIONS,
  TIMING_OPTIONS,
} from "@/lib/commission-options";
import type { Product } from "@/types/commerce";

type Props = {
  product: Product;
  locale: string;
};

const MAX_PHOTOS = 6;

export function CommissionForm({ product, locale }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "",
    petName: "",
    petBreed: "",
    petDescription: "",
    preferredStyle: "",
    timing: "",
    questions: "",
  });

  const labels =
    locale === "zh"
      ? {
          fullName: "您的全名",
          email: "电子邮件",
          country: "国家 / 地区",
          petName: "宠物名字",
          petBreed: "宠物品种",
          petDescription: "介绍一下它",
          preferredStyle: "喜欢的风格",
          timing: "希望何时开始定制",
          questions: "提交前还有什么问题",
          photos: "上传宠物照片",
          photosHint: "清晰正面、侧面更佳，最多 6 张",
          addFile: "添加文件",
          stylePlaceholder: "请选择风格",
          timingPlaceholder: "请选择时间",
          submit: "提交申请",
          loading: "提交中…",
        }
      : locale === "ms"
        ? {
            fullName: "Nama penuh anda",
            email: "E-mel",
            country: "Negara",
            petName: "Nama haiwan",
            petBreed: "Baka haiwan",
            petDescription: "Ceritakan sedikit tentang mereka",
            preferredStyle: "Gaya pilihan",
            timing: "Bilakah anda mahu mula?",
            questions: "Soalan sebelum hantar?",
            photos: "Muat naik foto haiwan",
            photosHint: "Hadapan & sisi jelas, maks. 6",
            addFile: "Tambah fail",
            stylePlaceholder: "Pilih gaya",
            timingPlaceholder: "Pilih masa",
            submit: "Hantar",
            loading: "Menghantar…",
          }
        : {
            fullName: "Your Full Name",
            email: "Email",
            country: "Country",
            petName: "Pet's Name",
            petBreed: "Pet Breed",
            petDescription: "Tell us a little about them",
            preferredStyle: "Preferred style",
            timing: "When were you hoping to commission?",
            questions: "What questions do you have?",
            photos: "Add pet photos",
            photosHint: "Clear front & side views help — up to 6",
            addFile: "Add file",
            stylePlaceholder: "Select a style",
            timingPlaceholder: "Select a timeline",
            submit: "Submit",
            loading: "Submitting…",
          };

  function optionLabel(item: { zh: string; en: string; ms: string }) {
    if (locale === "zh") return item.zh;
    if (locale === "ms") return item.ms;
    return item.en;
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const batch = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of batch) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || "上传失败");
        uploaded.push(data.url);
      }
      setPhotos((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.preferredStyle || !form.timing) {
      setError(
        locale === "zh"
          ? "请选择风格与定制时间"
          : "Please choose style and timing",
      );
      return;
    }
    if (photos.length === 0) {
      setError(
        locale === "zh" ? "请至少上传一张宠物照片" : "Please add at least one photo",
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          locale,
          photos,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Submit failed");
      router.push("/commission/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {(
        [
          ["fullName", "text"],
          ["email", "email"],
          ["country", "text"],
          ["petName", "text"],
          ["petBreed", "text"],
        ] as const
      ).map(([key, type]) => (
        <label key={key} className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            {labels[key]}
          </span>
          <input
            required={key === "fullName" || key === "email"}
            type={type}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/30 focus:ring-2"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </label>
      ))}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {labels.petDescription}
        </span>
        <textarea
          rows={4}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/30 focus:ring-2"
          value={form.petDescription}
          onChange={(e) =>
            setForm({ ...form, petDescription: e.target.value })
          }
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {labels.preferredStyle}
        </span>
        <select
          required
          className="w-full appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/30 focus:ring-2"
          value={form.preferredStyle}
          onChange={(e) =>
            setForm({ ...form, preferredStyle: e.target.value })
          }
        >
          <option value="">{labels.stylePlaceholder}</option>
          {STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {optionLabel(opt)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {labels.timing}
        </span>
        <select
          required
          className="w-full appearance-none rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/30 focus:ring-2"
          value={form.timing}
          onChange={(e) => setForm({ ...form, timing: e.target.value })}
        >
          <option value="">{labels.timingPlaceholder}</option>
          {TIMING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {optionLabel(opt)}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {labels.photos}
        </span>
        <p className="mb-2 text-xs text-ink-soft">{labels.photosHint}</p>
        {photos.length > 0 ? (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white"
                  onClick={() =>
                    setPhotos((prev) => prev.filter((item) => item !== url))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          disabled={uploading || photos.length >= MAX_PHOTOS}
          className="inline-flex items-center justify-center rounded-2xl border border-dashed border-line bg-white px-4 py-3 text-sm font-medium text-ink disabled:opacity-50"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "…" : labels.addFile}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            event.target.value = "";
            void uploadFiles(files);
          }}
        />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {labels.questions}
        </span>
        <textarea
          rows={3}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-accent/30 focus:ring-2"
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
        />
      </label>

      {error ? <p className="text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="btn-primary w-full disabled:opacity-60"
      >
        {saving ? labels.loading : labels.submit}
      </button>
    </form>
  );
}
