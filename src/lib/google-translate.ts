import { prisma } from "@/lib/db";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY ?? "";
const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  if (!API_KEY || !text.trim()) return text;

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: targetLang,
      format: "text",
    }),
  });

  if (!res.ok) return text;

  const json = await res.json();
  return (
    json?.data?.translations?.[0]?.translatedText ?? text
  );
}

async function translateTexts(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  if (!API_KEY || texts.length === 0) return texts;

  const nonEmpty = texts.map((t) => t || " ");

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: nonEmpty,
      source: "en",
      target: targetLang,
      format: "text",
    }),
  });

  if (!res.ok) return texts;

  const json = await res.json();
  const translations = json?.data?.translations;
  if (!Array.isArray(translations)) return texts;

  return translations.map(
    (t: { translatedText: string }, i: number) =>
      t?.translatedText ?? texts[i],
  );
}

export async function getProductTranslation(
  productId: string,
  locale: string,
  fallback: {
    name: string;
    shortDescription: string;
    description: string;
    details: string;
  },
): Promise<{
  name: string;
  shortDescription: string;
  description: string;
  details: string;
}> {
  if (locale === "en" || !API_KEY) return fallback;

  const cached = await prisma.productTranslation.findUnique({
    where: { productId_locale: { productId, locale } },
  });

  if (cached) {
    return {
      name: cached.name,
      shortDescription: cached.shortDescription,
      description: cached.description,
      details: cached.details,
    };
  }

  try {
    const [name, shortDescription, description, details] =
      await translateTexts(
        [
          fallback.name,
          fallback.shortDescription,
          fallback.description,
          fallback.details,
        ],
        locale,
      );

    await prisma.productTranslation.upsert({
      where: { productId_locale: { productId, locale } },
      create: {
        productId,
        locale,
        name,
        shortDescription,
        description,
        details,
      },
      update: { name, shortDescription, description, details },
    });

    return { name, shortDescription, description, details };
  } catch {
    return fallback;
  }
}

export async function getCategoryTranslation(
  categoryId: string,
  locale: string,
  fallbackName: string,
): Promise<string> {
  if (locale === "en" || !API_KEY) return fallbackName;

  const cached = await prisma.categoryTranslation.findUnique({
    where: { categoryId_locale: { categoryId, locale } },
  });

  if (cached) return cached.name;

  try {
    const name = await translateText(fallbackName, locale);

    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId, locale } },
      create: { categoryId, locale, name },
      update: { name },
    });

    return name;
  } catch {
    return fallbackName;
  }
}

export async function clearProductTranslationCache(
  productId: string,
): Promise<void> {
  await prisma.productTranslation.deleteMany({ where: { productId } });
}

export async function clearCategoryTranslationCache(
  categoryId: string,
): Promise<void> {
  await prisma.categoryTranslation.deleteMany({ where: { categoryId } });
}
