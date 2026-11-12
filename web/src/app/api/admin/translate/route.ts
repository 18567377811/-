import { badRequest, withAdmin } from "@/lib/admin-api";
import { translateZhToLocales } from "@/lib/translate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TranslateItem = {
  id: string;
  text: string;
  html?: boolean;
};

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    const items = body?.items as TranslateItem[] | undefined;
    if (!Array.isArray(items) || items.length === 0) {
      throw badRequest("缺少翻译内容");
    }
    if (items.length > 40) {
      throw badRequest("单次翻译条目过多");
    }

    const translations: Record<string, { en: string; ms: string }> = {};
    for (const item of items) {
      const id = String(item?.id ?? "").trim();
      const text = String(item?.text ?? "");
      if (!id) throw badRequest("翻译条目缺少 id");
      if (!text.trim()) {
        translations[id] = { en: "", ms: "" };
        continue;
      }
      translations[id] = await translateZhToLocales(text, {
        html: Boolean(item.html),
      });
    }
    return { translations };
  });
}
