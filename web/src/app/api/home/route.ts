import { NextResponse } from "next/server";
import { getHomePayload } from "@/lib/catalog-queries";
import { routing, type AppLocale } from "@/i18n/routing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function localeFrom(request: Request): AppLocale {
  const value = new URL(request.url).searchParams.get("locale");
  if (value && routing.locales.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return routing.defaultLocale;
}

export async function GET(request: Request) {
  const locale = localeFrom(request);
  const payload = await getHomePayload(locale);
  return NextResponse.json(payload);
}
