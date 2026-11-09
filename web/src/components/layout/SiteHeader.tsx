import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CartBadge } from "./CartBadge";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const brand = await getTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color:var(--paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="group min-w-0">
          <div className="font-display text-xl tracking-tight text-ink transition group-hover:text-accent sm:text-2xl">
            {brand("name")}
          </div>
          <p className="hidden text-xs text-ink-soft sm:block">
            {brand("tagline")}
          </p>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/collections/portrait" className="hover:text-accent">
            {t("portrait")}
          </Link>
          <Link href="/collections/miniature" className="hover:text-accent">
            {t("miniature")}
          </Link>
          <Link href="/guide/photo" className="hover:text-accent">
            {t("photoGuide")}
          </Link>
          <Link href="/about" className="hover:text-accent">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
