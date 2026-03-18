import type { Messages } from "@/messages/en";

export type Locale = "en" | "ar" | "fr";

export const LOCALES: Locale[] = ["en", "ar", "fr"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ar: "العربية",
  fr: "FR",
};

export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export const STORAGE_KEY = "madilik-locale";

export function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(params[key] ?? ""),
  );
}
