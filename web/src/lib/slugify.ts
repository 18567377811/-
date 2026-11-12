/** Build a URL-safe slug from a display name (prefer English after auto-translate). */
export function slugifyLabel(input: string, fallbackPrefix = "item"): string {
  const ascii = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60);

  if (ascii) return ascii;

  // Chinese-only / empty latin → stable short token
  const compact = input.replace(/\s+/g, "").slice(0, 12);
  if (compact) {
    const hash = Array.from(compact)
      .map((ch) => ch.codePointAt(0)?.toString(36) ?? "")
      .join("")
      .slice(0, 24);
    if (hash) return `${fallbackPrefix}-${hash}`;
  }
  return `${fallbackPrefix}-${Date.now().toString(36)}`;
}

export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugifyLabel(base) || `item-${Date.now().toString(36)}`;
  if (!(await exists(root))) return root;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${root}-${i}`.slice(0, 72);
    if (!(await exists(candidate))) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}
