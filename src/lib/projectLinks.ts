/**
 * Canonical external URL when `link` is usable as an outbound link,
 * otherwise `null` → use an in-site project detail page instead.
 */
export function getExternalProjectUrl(link: unknown): string | null {
  if (typeof link !== 'string') return null;
  const trimmed = link.trim();
  if (!trimmed) return null;
  const candidate = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname) {
      return url.href;
    }
  } catch {
    /* malformed URL */
  }
  return null;
}

/** Plaintext excerpt from stored HTML (admin list previews). */
export function stripHtmlToPlain(html: unknown, maxLen = 140): string {
  if (typeof html !== 'string' || !html.trim()) return '';
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}…`;
}
