import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-line bg-[color:var(--paper-muted)]/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-3 py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-ink">Feltora</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            {t("rights", { year: 2026 })}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
            {t("shop")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/collections/portrait" className="hover:text-accent">
                {nav("portrait")}
              </Link>
            </li>
            <li>
              <Link href="/collections/miniature" className="hover:text-accent">
                {nav("miniature")}
              </Link>
            </li>
            <li>
              <Link href="/guide/photo" className="hover:text-accent">
                {nav("photoGuide")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
            {t("info")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/about" className="hover:text-accent">
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                {nav("contact")}
              </Link>
            </li>
            <li>
              <span>{t("refund")}</span>
            </li>
            <li>
              <span>{t("shipping")}</span>
            </li>
            <li>
              <span>{t("terms")}</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
