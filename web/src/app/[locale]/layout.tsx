import type { Metadata } from "next";
import { Fraunces, Manrope, Noto_Sans_SC } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RegionProvider } from "@/components/layout/RegionProvider";
import { SocialContactProvider } from "@/components/layout/social";
import { routing } from "@/i18n/routing";
import { getLocalizedSiteContent } from "@/lib/site-config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const noto = Noto_Sans_SC({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const site = await getLocalizedSiteContent(locale);

  return {
    title: site.siteTitle || t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const site = await getLocalizedSiteContent(locale);

  return (
    <div
      lang={locale}
      className={`${manrope.variable} ${fraunces.variable} ${noto.variable} flex min-h-dvh flex-col antialiased`}
      style={
        {
          ["--accent" as string]: site.themeAccent,
          ["--accent-deep" as string]: site.themeAccent,
        } as React.CSSProperties
      }
    >
      <NextIntlClientProvider messages={messages}>
        <RegionProvider regions={site.regions}>
          <SocialContactProvider links={site.social}>
            <SiteHeader siteTitle={site.siteTitle} logoUrl={site.logoUrl} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SocialContactProvider>
        </RegionProvider>
      </NextIntlClientProvider>
    </div>
  );
}
