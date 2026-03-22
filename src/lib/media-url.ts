import { siteConfig } from "@/config/site";

/**
 * Absolute URL for a stored media path (relative like /uploads/... or full URL).
 * Use when the consumer is not the browser same-origin (emails, metadata, etc.).
 * In the storefront, prefer relative paths so they work on localhost and production.
 */
export function absoluteMediaUrl(path: string): string {
  if (!path?.trim()) return "";
  const p = path.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const base = siteConfig.url.replace(/\/$/, "");
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${base}${rel}`;
}
