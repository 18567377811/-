export type LocaleTriple = { zh: string; en: string; ms: string };

export type LocaleSyncItem = {
  id: string;
  current: LocaleTriple;
  /** Snapshot when the editor opened. Null/undefined = create flow. */
  baseline?: LocaleTriple | null;
  html?: boolean;
};

function looksUntranslated(zh: string, target: string): boolean {
  const t = target.trim();
  if (!t) return true;
  // Server fallback used to copy zh into en/ms — treat as needing real translation.
  return t === zh.trim();
}

/**
 * Decide whether EN/MS should be filled from Chinese.
 * - Chinese changed → always refresh both.
 * - Chinese unchanged → only fill empty / still-equal-to-zh targets (keep custom EN/MS).
 */
export function planLocaleSync(
  current: LocaleTriple,
  baseline?: LocaleTriple | null,
): { translate: boolean; fillEn: boolean; fillMs: boolean } {
  const zh = current.zh.trim();
  if (!zh) {
    return { translate: false, fillEn: false, fillMs: false };
  }

  const zhChanged = !baseline || current.zh !== baseline.zh;
  if (zhChanged) {
    return { translate: true, fillEn: true, fillMs: true };
  }

  const fillEn = looksUntranslated(current.zh, current.en);
  const fillMs = looksUntranslated(current.zh, current.ms);
  return { translate: fillEn || fillMs, fillEn, fillMs };
}

/** @deprecated use planLocaleSync */
export function shouldSyncFromZh(
  current: LocaleTriple,
  baseline?: LocaleTriple | null,
): boolean {
  return planLocaleSync(current, baseline).translate;
}

/**
 * If Chinese changed → translate and overwrite EN/MS.
 * If only custom EN/MS edited → leave them.
 * If EN/MS empty (or still equal to Chinese) → fill via translation even when Chinese unchanged.
 */
export async function syncLocaleTriples(
  items: LocaleSyncItem[],
): Promise<Record<string, LocaleTriple>> {
  const result: Record<string, LocaleTriple> = {};
  const plans = new Map<string, ReturnType<typeof planLocaleSync>>();

  for (const item of items) {
    result[item.id] = { ...item.current };
    plans.set(item.id, planLocaleSync(item.current, item.baseline));
  }

  const need = items.filter((item) => plans.get(item.id)?.translate);
  if (need.length === 0) return result;

  const res = await fetch("/api/admin/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: need.map((item) => ({
        id: item.id,
        text: item.current.zh,
        html: Boolean(item.html),
      })),
    }),
  });
  const data = (await res.json()) as {
    translations?: Record<string, { en: string; ms: string }>;
    error?: string;
  };
  if (!res.ok || !data.translations) {
    throw new Error(data.error || "自动翻译失败");
  }

  for (const item of need) {
    const translated = data.translations[item.id];
    const plan = plans.get(item.id);
    if (!translated || !plan) continue;
    result[item.id] = {
      zh: item.current.zh,
      en: plan.fillEn ? translated.en : item.current.en,
      ms: plan.fillMs ? translated.ms : item.current.ms,
    };
  }
  return result;
}

export function triple(zh: string, en: string, ms: string): LocaleTriple {
  return { zh, en, ms };
}
