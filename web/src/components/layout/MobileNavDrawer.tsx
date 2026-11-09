"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CloseIcon } from "./HeaderIcons";

type Props = {
  open: boolean;
  onClose: () => void;
};

const LINKS = [
  { href: "/" as const, key: "home" as const },
  { href: "/guide/photo" as const, key: "makeGuide" as const },
  { href: "/about" as const, key: "about" as const },
];

export function MobileNavDrawer({ open, onClose }: Props) {
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[55] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label={t("closeMenu")}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        className={`absolute right-0 top-0 flex h-full w-[min(86vw,320px)] flex-col bg-[#fffdf9] shadow-[-12px_0_40px_rgba(43,33,28,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm ring-1 ring-line"
            aria-label={t("closeMenu")}
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-6 pb-10 pt-6">
          {LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className="rounded-2xl px-2 py-4 font-display text-[1.35rem] tracking-tight text-[#2f4a52] transition hover:bg-blush/35"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
