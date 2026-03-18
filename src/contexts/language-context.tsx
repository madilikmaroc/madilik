"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ar } from "@/messages/ar";
import { en } from "@/messages/en";
import { fr } from "@/messages/fr";
import {
  DEFAULT_LOCALE,
  interpolate,
  isRtl,
  STORAGE_KEY,
  type Locale,
} from "@/lib/i18n";
import type { Messages } from "@/messages/en";

const messagesMap: Record<Locale, Messages> = { en, ar, fr };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && (stored === "en" || stored === "ar" || stored === "fr"))
    return stored;
  return DEFAULT_LOCALE;
}

function getValue(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale === "ar" ? "ar" : newLocale;
      document.documentElement.dir = isRtl(newLocale) ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === "ar" ? "ar" : locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale, mounted]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const messages = messagesMap[locale];
      const value = getValue(messages, key);
      if (!value) return key;
      return params ? interpolate(value, params) : value;
    },
    [locale],
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    dir: isRtl(locale) ? "rtl" : "ltr",
    isRtl: isRtl(locale),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
