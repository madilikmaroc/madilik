"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FLAG_CONFIG: Record<Locale, { src: string; code: string }> = {
  ar: { src: "/flags/maroc.png", code: "AR" },
  fr: { src: "/flags/france.png", code: "FR" },
  en: { src: "/flags/uk.png", code: "EN" },
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = FLAG_CONFIG[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Image
          src={current.src}
          alt={current.code}
          width={20}
          height={14}
          className="rounded-sm object-cover"
          unoptimized
        />
        <span className="text-xs font-semibold">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[100px] rounded-lg border bg-popover p-1 shadow-lg">
          {LOCALES.map((loc) => {
            const cfg = FLAG_CONFIG[loc];
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocale(loc);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted",
                  loc === locale && "bg-muted font-semibold"
                )}
              >
                <Image
                  src={cfg.src}
                  alt={cfg.code}
                  width={20}
                  height={14}
                  className="rounded-sm object-cover"
                  unoptimized
                />
                <span className="text-xs font-semibold">{cfg.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
