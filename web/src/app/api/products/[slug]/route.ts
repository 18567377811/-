import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog-queries";
import { routing, type AppLocale } from "@/i18n/routing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

function localeFrom(request: Request): AppLocale {
  const value = new URL(request.url).searchParams.get("locale");
  if (value && routing.locales.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return routing.defaultLocale;
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const locale = localeFrom(request);
  const product = await getProductBySlug(slug, locale);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
