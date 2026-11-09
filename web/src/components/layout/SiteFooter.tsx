import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FooterPayments } from "./FooterPayments";
import { FooterSocial } from "./FooterSocial";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-line bg-[color:var(--paper-muted)]/80">
      <div className="mx-auto max-w-6xl px-3 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
        {/* Brand + link columns */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <div className="text-left">
            <p className="font-display text-2xl text-ink">Feltora</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              {t("rights", { year: 2026 })}
            </p>
          </div>

          {/* Mobile: shop | info side-by-side, left-aligned; desktop: two of three cols */}
          <div className="grid grid-cols-2 gap-6 text-left md:col-span-2 md:grid-cols-2 md:gap-10">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                {t("shop")}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                <li>
                  <Link
                    href="/collections/portrait"
                    className="hover:text-accent"
                  >
                    {nav("portrait")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/miniature"
                    className="hover:text-accent"
                  >
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
        </div>

        {/* Social + Stripe payment methods */}
        <div className="mt-10 border-t border-line/80 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <FooterSocial />
            <div className="min-w-0">
              <p className="mb-2 text-xs text-ink-soft sm:text-right">
                {t("powered")}
              </p>
              <FooterPayments />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
