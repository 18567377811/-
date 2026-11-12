/** Strip tags / decode basic entities for card & list plain-text display. */
export function stripHtml(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Prefer summary; if empty, fall back to plain text extracted from rich description. */
export function cardPlainText(
  summary: string | null | undefined,
  description?: string | null,
): string {
  const fromSummary = stripHtml(summary);
  if (fromSummary) return fromSummary;
  return stripHtml(description);
}

export function looksLikeHtml(input: string | null | undefined): boolean {
  if (!input) return false;
  return /<\/?[a-z][\s\S]*>/i.test(input);
}
