import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <div className="mx-auto max-w-2xl px-3 pt-10 pb-20 sm:px-6 sm:pt-12">
      <ClearCartOnMount />
      <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">
        {t("successEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
        {t("successTitle")}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-soft">
        {t("successBody")}
      </p>
      {sessionId ? (
        <p className="mt-4 break-all text-xs text-ink-soft/80">
          {t("reference")}: {sessionId}
        </p>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/guide/photo" className="btn-primary">
          {t("photoGuide")}
        </Link>
        <Link href="/" className="btn-ghost">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
