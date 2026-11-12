"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IconBold,
  IconChevronDown,
  IconChevronUp,
  IconClose,
  IconHeading,
  IconImage,
  IconItalic,
  IconLink,
  IconList,
  IconOrderedList,
  IconUnderline,
  IconUpload,
} from "@/components/admin/icons";
import { adminToast } from "@/components/admin/toast";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <span className="admin-label">{label}</span>
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  /** When true, header toggles body open/closed (chevron on the right). */
  collapsible?: boolean;
  /** Initial open state when collapsible. Default true. */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <section className="admin-section">
        <div className="admin-section-head">{title}</div>
        <div className="admin-section-body">{children}</div>
      </section>
    );
  }

  return (
    <section className="admin-section" data-collapsed={open ? "false" : "true"}>
      <button
        type="button"
        className="admin-section-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="admin-section-head admin-section-head-inline">
          {title}
        </span>
        {open ? (
          <IconChevronUp className="h-5 w-5 shrink-0 text-[var(--ios-secondary)]" />
        ) : (
          <IconChevronDown className="h-5 w-5 shrink-0 text-[var(--ios-secondary)]" />
        )}
      </button>
      {open ? <div className="admin-section-body">{children}</div> : null}
    </section>
  );
}

/** Nested block inside a Section — stronger title than field labels. */
export function ItemCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-item-card">
      <div className="admin-item-head">
        <div className="min-w-0">
          <p className="admin-item-title">{title}</p>
          {subtitle ? <p className="admin-item-subtitle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[var(--ios-shadow)]">
      <span className="text-[15px] font-medium">{label}</span>
      <button
        type="button"
        className="admin-toggle"
        data-on={on ? "true" : "false"}
        aria-pressed={on}
        onClick={() => onChange(!on)}
      />
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "请选择",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((item) => item.value === value);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const menuHeight = Math.min(options.length * 48 + 8, 224);
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;
    setMenuStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
      zIndex: 90,
      maxHeight: Math.min(menuHeight, openUp ? rect.top - 12 : spaceBelow),
    });
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    function onDoc(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onReposition() {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const menuHeight = Math.min(options.length * 48 + 8, 224);
      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;
      setMenuStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        top: openUp ? undefined : rect.bottom + 6,
        bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
        zIndex: 90,
        maxHeight: Math.min(menuHeight, openUp ? rect.top - 12 : spaceBelow),
      });
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, options.length]);

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <div ref={menuRef} className="admin-select-menu" style={menuStyle}>
            {options.map((option) => (
              <button
                key={option.value || "__empty"}
                type="button"
                className={`admin-select-option ${
                  option.value === value ? "is-active" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="admin-select-wrap relative" ref={rootRef}>
      <button
        type="button"
        className="admin-select flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selected ? "" : "text-[var(--ios-secondary)]"}>
          {selected?.label ?? placeholder}
        </span>
        <IconChevronDown className="h-4 w-4 shrink-0 text-[var(--ios-secondary)]" />
      </button>
      {menu}
    </div>
  );
}

export function LocaleFields({
  values,
  onChange,
  multiline = false,
  rich = false,
  placeholders,
}: {
  values: { zh: string; en: string; ms: string };
  onChange: (next: { zh: string; en: string; ms: string }) => void;
  multiline?: boolean;
  rich?: boolean;
  placeholders?: { zh?: string; en?: string; ms?: string };
}) {
  const [lang, setLang] = useState<"zh" | "en" | "ms">("zh");
  const labels = { zh: "中文", en: "EN", ms: "MS" } as const;

  return (
    <div className="space-y-2.5">
      <div className="admin-lang-tabs" role="tablist">
        {(["zh", "en", "ms"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            className="admin-lang-tab"
            data-active={lang === key ? "true" : "false"}
            onClick={() => setLang(key)}
          >
            {labels[key]}
          </button>
        ))}
      </div>
      <p className="text-[11px] leading-snug text-[var(--ios-secondary)]">
        优先填中文。保存时会自动翻译空的 EN/MS；中文改动后会重新同步译文。手动改过的译文不会被覆盖。
      </p>
      {rich ? (
        <RichTextEditor
          value={values[lang]}
          onChange={(html) => onChange({ ...values, [lang]: html })}
        />
      ) : multiline ? (
        <textarea
          className="admin-textarea"
          value={values[lang]}
          placeholder={placeholders?.[lang]}
          onChange={(event) =>
            onChange({ ...values, [lang]: event.target.value })
          }
        />
      ) : (
        <input
          className="admin-input"
          value={values[lang]}
          placeholder={placeholders?.[lang]}
          onChange={(event) =>
            onChange({ ...values, [lang]: event.target.value })
          }
        />
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  function emit() {
    onChange(ref.current?.innerHTML ?? "");
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (ref.current?.contains(range.commonAncestorContainer)) {
      savedRange.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    if (savedRange.current) {
      selection.addRange(savedRange.current);
    } else {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.addRange(range);
    }
  }

  function run(command: string, commandValue?: string) {
    restoreSelection();
    document.execCommand(command, false, commandValue);
    emit();
    rememberSelection();
  }

  function insertLink() {
    const url = window.prompt("输入链接地址", "https://");
    if (!url) return;
    run("createLink", url);
  }

  async function insertImage(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "上传失败");
      restoreSelection();
      const safeUrl = data.url.replace(/"/g, "&quot;");
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${safeUrl}" alt="" />`,
      );
      emit();
      rememberSelection();
      adminToast.success("图片已插入");
    } catch (error) {
      adminToast.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  const tools = [
    { label: "加粗", Icon: IconBold, action: () => run("bold") },
    { label: "斜体", Icon: IconItalic, action: () => run("italic") },
    { label: "下划线", Icon: IconUnderline, action: () => run("underline") },
    {
      label: "标题",
      Icon: IconHeading,
      action: () => run("formatBlock", "h3"),
    },
    {
      label: "无序列表",
      Icon: IconList,
      action: () => run("insertUnorderedList"),
    },
    {
      label: "有序列表",
      Icon: IconOrderedList,
      action: () => run("insertOrderedList"),
    },
    { label: "链接", Icon: IconLink, action: insertLink },
  ] as const;

  return (
    <div className="overflow-hidden rounded-[0.9rem] bg-[var(--ios-fill)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--ios-separator)] px-2 py-1.5">
        {tools.map(({ label, Icon, action }) => (
          <button
            key={label}
            type="button"
            className="admin-icon-btn"
            aria-label={label}
            title={label}
            onMouseDown={(e) => {
              e.preventDefault();
              rememberSelection();
              action();
            }}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          className="admin-icon-btn"
          aria-label="插入图片"
          title="插入图片"
          disabled={uploading}
          onMouseDown={(e) => {
            e.preventDefault();
            rememberSelection();
            fileRef.current?.click();
          }}
        >
          <IconImage className="h-4 w-4" />
        </button>
        <span className="ml-auto text-[11px] text-[var(--ios-secondary)]">
          {uploading ? "上传中…" : "富文本"}
        </span>
      </div>
      <div
        ref={ref}
        className="admin-richtext"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onPaste={(event) => {
          // Avoid Word/Google Docs span soup — paste plain text only.
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          if (!text) return;
          rememberSelection();
          document.execCommand("insertText", false, text);
          emit();
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void insertImage(file);
        }}
      />
    </div>
  );
}

export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "上传失败");
      }
      onChange(data.url);
      adminToast.success("图片已上传");
    } catch (err) {
      const message = err instanceof Error ? err.message : "上传失败";
      setError(message);
      adminToast.error(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-image-box">
      {value ? (
        <div className="admin-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
        </div>
      ) : (
        <div className="admin-image-preview flex items-center justify-center text-sm text-[var(--ios-secondary)]">
          暂无预览
        </div>
      )}

      <button
        type="button"
        className="admin-btn admin-btn-primary w-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <IconUpload className="h-4 w-4" />
        {uploading ? "上传中…" : "上传本地图片"}
      </button>

      <Field label="网络地址">
        <input
          className="admin-input"
          value={value}
          placeholder="https://..."
          onChange={(event) => onChange(event.target.value.trim())}
        />
      </Field>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />

      {error ? (
        <p className="text-sm text-[var(--ios-red)]">{error}</p>
      ) : null}
    </div>
  );
}

export function Thumb({
  src,
  alt = "",
}: {
  src?: string | null;
  alt?: string;
}) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--ios-fill)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--ios-secondary)]">
          无图
        </div>
      )}
    </div>
  );
}

export function Sheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const suppressCloseUntil = useRef(0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // File pickers blur the window; the ensuing "ghost click" must not close the sheet.
    const bump = () => {
      suppressCloseUntil.current = Date.now() + 1200;
    };
    window.addEventListener("blur", bump);
    window.addEventListener("focus", bump);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("blur", bump);
      window.removeEventListener("focus", bump);
    };
  }, [open]);

  function requestClose() {
    if (Date.now() < suppressCloseUntil.current) return;
    onClose();
  }

  if (!open) return null;
  return (
    <div
      className="admin-sheet"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className="admin-sheet-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-sheet-header">
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn-ghost"
            aria-label="关闭"
            onClick={requestClose}
          >
            <IconClose className="h-5 w-5" />
          </button>
          <h3 className="text-[17px] font-semibold">{title}</h3>
          <span className="w-9" />
        </div>
        <div className="admin-sheet-body space-y-3 px-4 py-4">{children}</div>
        {footer ? <div className="admin-sheet-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-[var(--ios-separator)] bg-white/60 px-6 py-14 text-center text-[var(--ios-secondary)]">
      {text}
    </div>
  );
}

export function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[var(--ios-shadow)]">
      {children}
    </div>
  );
}
