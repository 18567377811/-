export type TranslateTarget = "en" | "ms";

const LANG: Record<"zh" | TranslateTarget, string> = {
  zh: "zh-CN",
  en: "en",
  ms: "ms",
};

const MAX_CHUNK_BYTES = 450;

function chunkByBytes(text: string, maxBytes = MAX_CHUNK_BYTES): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const char of text) {
    const next = current + char;
    if (Buffer.byteLength(next, "utf8") > maxBytes) {
      if (current) chunks.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function protectMarkup(html: string): {
  text: string;
  restore: (translated: string) => string;
} {
  const tags: string[] = [];
  const text = html.replace(/<[^>]+>/g, (tag) => {
    const index = tags.length;
    tags.push(tag);
    return `[[T${index}]]`;
  });
  return {
    text,
    restore: (translated) =>
      translated.replace(/\[\[T(\d+)\]\]/g, (_, raw) => {
        const index = Number(raw);
        return tags[index] ?? "";
      }),
  };
}

function statusOk(status: unknown): boolean {
  return status === 200 || status === "200";
}

/** MyMemory free API: https://api.mymemory.translated.net */
async function translateViaMyMemory(
  text: string,
  to: TranslateTarget,
): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL?.trim();
  const params = new URLSearchParams({
    q: text,
    langpair: `${LANG.zh}|${LANG[to]}`,
  });
  if (email) params.set("de", email);

  const res = await fetch(
    `https://api.mymemory.translated.net/get?${params.toString()}`,
    { method: "GET", cache: "no-store" },
  );
  const data = (await res.json()) as {
    responseStatus?: number | string;
    responseData?: { translatedText?: string };
    responseDetails?: string;
    quotaFinished?: boolean;
  };
  const translated = data.responseData?.translatedText?.trim();
  if (!res.ok || !statusOk(data.responseStatus) || !translated) {
    const detail =
      (typeof data.responseDetails === "string" && data.responseDetails) ||
      (data.quotaFinished
        ? "翻译额度已用完，请在 .env 填写 MYMEMORY_EMAIL"
        : `HTTP ${res.status}`);
    throw new Error(`MyMemory 失败：${detail}`);
  }
  if (/^INVALID\b/i.test(translated)) {
    throw new Error(`MyMemory 失败：${translated}`);
  }
  return translated;
}

/**
 * Google free gtx endpoint — fallback when MyMemory fails.
 * May be unreachable from some CN networks.
 */
async function translateViaGoogle(
  text: string,
  to: TranslateTarget,
): Promise<string> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "zh-CN",
    tl: to === "ms" ? "ms" : "en",
    dt: "t",
    q: text,
  });
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    { method: "GET", cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Google 翻译 HTTP ${res.status}`);
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Google 翻译返回格式异常");
  }
  const joined = (data[0] as unknown[])
    .map((part) => (Array.isArray(part) ? String(part[0] ?? "") : ""))
    .join("")
    .trim();
  if (!joined) throw new Error("Google 翻译结果为空");
  return joined;
}

async function translateChunk(
  text: string,
  to: TranslateTarget,
): Promise<string> {
  try {
    return await translateViaMyMemory(text, to);
  } catch (primaryError) {
    try {
      return await translateViaGoogle(text, to);
    } catch {
      throw primaryError instanceof Error
        ? primaryError
        : new Error("翻译接口调用失败");
    }
  }
}

export async function translateText(
  text: string,
  to: TranslateTarget,
  options?: { html?: boolean },
): Promise<string> {
  const raw = text.trim();
  if (!raw) return "";

  const protectedMarkup = options?.html ? protectMarkup(raw) : null;
  const source = protectedMarkup?.text ?? raw;
  const parts = chunkByBytes(source);
  const translatedParts: string[] = [];
  for (const part of parts) {
    translatedParts.push(await translateChunk(part, to));
  }
  const joined = translatedParts.join("");
  return protectedMarkup ? protectedMarkup.restore(joined) : joined;
}

export async function translateZhToLocales(
  text: string,
  options?: { html?: boolean },
): Promise<{ en: string; ms: string }> {
  const [en, ms] = await Promise.all([
    translateText(text, "en", options),
    translateText(text, "ms", options),
  ]);
  return { en, ms };
}
