"use client";

import { formatPrice } from "@/lib/formatters";
import { useLanguage } from "@/contexts/language-context";

export function Price({ value, className }: { value: number; className?: string }) {
  const { locale } = useLanguage();
  return <span className={className}>{formatPrice(value, locale)}</span>;
}
