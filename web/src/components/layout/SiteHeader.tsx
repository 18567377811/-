"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { CartBadge } from "./CartBadge";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { BackIcon, MenuIcon, SearchIcon } from "./HeaderIcons";
import { MobileNavDrawer } from "./MobileNavDrawer";

const DESKTOP_LINKS = [
  { href: "/" as const, key: "home" as const },
  { href: "/guide/photo" as const, key: "makeGuide" as const },
  { href: "/about" as const, key: "about" as const },
];

type Props = {
  siteTitle?: string;
  logoUrl?: string;
};

export function SiteHeader({ siteTitle, logoUrl }: Props) {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/" || pathname === "";
  const title = siteTitle?.trim() || brand("name");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-[color:var(--paper)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {isHome ? (
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/55 md:hidden"
                aria-label={t("menu")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon className="h-[1.15rem] w-[1.15rem]" />
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/55"
                aria-label={t("back")}
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.history.length > 1
                  ) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
              >
                <BackIcon className="h-[1.15rem] w-[1.15rem]" />
              </button>
            )}

            <Link href="/" className="group flex min-w-0 items-center gap-2.5">
              {logoUrl ? (
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f7efe6] ring-1 ring-[rgba(43,33,28,0.08)] sm:h-10 sm:w-10">
                  <Image
                    src={logoUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block font-display text-xl tracking-tight text-ink transition group-hover:text-accent sm:text-2xl">
                  {title}
                </span>
                <span className="hidden text-xs text-ink-soft sm:block">
                  {brand("tagline")}
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {DESKTOP_LINKS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-ink transition hover:text-accent"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/55"
              aria-label={t("search")}
            >
              <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <LocaleSwitcher />
            <CartBadge />
          </div>
        </div>
      </header>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
