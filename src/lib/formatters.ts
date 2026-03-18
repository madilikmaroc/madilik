import type { Locale } from "./i18n";

const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-MA",
  ar: "ar-MA",
};

/** Format price in Moroccan Dirham (MAD) */
export function formatPrice(price: number, locale: Locale = "en"): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
