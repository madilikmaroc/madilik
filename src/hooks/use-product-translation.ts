"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import type { ProductDisplay } from "@/types/product";

interface TranslatedFields {
  name: string;
  shortDescription: string;
  description: string;
  details: string;
  categoryName: string;
}

const cache = new Map<string, TranslatedFields>();

export function useProductTranslation(product: ProductDisplay): TranslatedFields {
  const { locale } = useLanguage();
  const cacheKey = `${product.id}:${locale}`;

  const fallback: TranslatedFields = {
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    details: product.details,
    categoryName: product.category.name,
  };

  const [translated, setTranslated] = useState<TranslatedFields>(
    () => cache.get(cacheKey) ?? fallback,
  );

  useEffect(() => {
    if (locale === "en") {
      setTranslated(fallback);
      return;
    }

    const cached = cache.get(cacheKey);
    if (cached) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        categoryId: product.category.id,
        locale,
        fallback: {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          details: product.details,
          categoryName: product.category.name,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const result: TranslatedFields = {
          name: data.name ?? product.name,
          shortDescription: data.shortDescription ?? product.shortDescription,
          description: data.description ?? product.description,
          details: data.details ?? product.details,
          categoryName: data.categoryName ?? product.category.name,
        };
        cache.set(cacheKey, result);
        setTranslated(result);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, product.id]);

  return translated;
}
