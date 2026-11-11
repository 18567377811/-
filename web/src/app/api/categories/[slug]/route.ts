import { NextResponse } from "next/server";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/lib/catalog-queries";
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
  const category = await getCategoryBySlug(slug, locale);
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const products = await getProductsByCategorySlug(slug, locale);
  return NextResponse.json({ category, products });
}
