"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  token: string | null;
};

export function PayPalReturnClient({ token }: Props) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    void (async () => {
      try {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: token }),
        });
        const data = (await response.json()) as {
          orderID?: string;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error || t("paypalCaptureError"));
        }
        window.location.replace(
          `/${locale}/checkout/success?paypal_order_id=${encodeURIComponent(token)}`,
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t("paypalCaptureError"),
        );
      }
    })();
  }, [locale, t, token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-2xl px-3 pt-10 pb-20 sm:px-6 sm:pt-12">
        <h1 className="font-display text-3xl text-ink">{t("paypalMissing")}</h1>
        <Link href="/cart" className="btn-primary mt-8 inline-flex">
          {t("backCart")}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-3 pt-10 pb-20 sm:px-6 sm:pt-12">
        <h1 className="font-display text-3xl text-ink">{t("paypalCaptureTitle")}</h1>
        <p className="mt-4 text-clay" role="alert">
          {error}
        </p>
        <Link href="/cart" className="btn-primary mt-8 inline-flex">
          {t("backCart")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-3 pt-10 pb-20 sm:px-6 sm:pt-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">
        {t("paypalProcessingEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">
        {t("paypalProcessingTitle")}
      </h1>
      <p className="mt-5 text-lg text-ink-soft">{t("paypalProcessingBody")}</p>
    </div>
  );
}
