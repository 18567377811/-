"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import {
  SOCIAL_ICON_PATHS,
  activeSocialLinks,
  type SocialItem,
} from "@/components/layout/social-data";

export type { SocialItem };
export { activeSocialLinks, SOCIAL_ICON_PATHS };

type SocialContactContextValue = {
  openContact: () => void;
  closeContact: () => void;
};

const SocialContactContext = createContext<SocialContactContextValue | null>(
  null,
);

function SocialIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        className="fill-current"
        d={SOCIAL_ICON_PATHS[id] || SOCIAL_ICON_PATHS.instagram}
      />
    </svg>
  );
}

function SocialContactModal({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: SocialItem[];
}) {
  const locale = useLocale();
  const items = activeSocialLinks(links);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/35 p-4 backdrop-blur-[6px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={locale === "zh" ? "联系我们" : "Contact us"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-[1.5rem] bg-white p-5 shadow-[0_20px_50px_rgba(43,33,28,0.18)] ring-1 ring-[color:var(--line)] sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-accent uppercase">
              {locale === "zh" ? "社交" : "Social"}
            </p>
            <h3 className="mt-1 font-display text-xl text-ink">
              {locale === "zh" ? "联系我们" : "Contact us"}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {locale === "zh"
                ? "选择一个平台，跳转后即可私信我们。"
                : "Pick a channel and message us there."}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-muted text-ink-soft transition hover:bg-blush/50"
            aria-label={locale === "zh" ? "关闭" : "Close"}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M7 7l10 10M17 7 7 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-paper-muted px-4 py-5 text-center text-sm text-ink-soft">
            {locale === "zh"
              ? "暂未配置社媒链接，请到后台系统配置里填写。"
              : "Social links are not set up yet in admin settings."}
          </p>
        ) : (
          <ul className="mt-5 grid gap-2.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-paper px-3.5 py-3 ring-1 ring-[color:var(--line)] transition hover:bg-blush/35 hover:ring-accent/25"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-sm ring-1 ring-[color:var(--line)]">
                    <SocialIcon id={item.id} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {item.href.replace(/^https?:\/\//i, "")}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-ink-soft"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 5.5 15.5 12 9 18.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function SocialContactProvider({
  links,
  children,
}: {
  links: SocialItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);
  const value = useMemo(
    () => ({ openContact, closeContact }),
    [openContact, closeContact],
  );

  return (
    <SocialContactContext.Provider value={value}>
      {children}
      <SocialContactModal open={open} onClose={closeContact} links={links} />
    </SocialContactContext.Provider>
  );
}

export function useSocialContact() {
  const ctx = useContext(SocialContactContext);
  if (!ctx) {
    throw new Error("useSocialContact must be used within SocialContactProvider");
  }
  return ctx;
}

export function ContactUsButton({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const t = useTranslations();
  const { openContact } = useSocialContact();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openContact();
      }}
    >
      {label || t("products.contactUs")}
    </button>
  );
}
