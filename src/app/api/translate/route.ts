import { NextRequest, NextResponse } from "next/server";
import {
  getProductTranslation,
  getCategoryTranslation,
} from "@/lib/google-translate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, categoryId, locale, fallback } = body;

    if (!locale || locale === "en") {
      return NextResponse.json(fallback ?? {});
    }

    const result: Record<string, unknown> = {};

    if (productId && fallback?.name) {
      const translated = await getProductTranslation(productId, locale, {
        name: fallback.name,
        shortDescription: fallback.shortDescription ?? "",
        description: fallback.description ?? "",
        details: fallback.details ?? "",
      });
      Object.assign(result, translated);
    }

    if (categoryId && fallback?.categoryName) {
      result.categoryName = await getCategoryTranslation(
        categoryId,
        locale,
        fallback.categoryName,
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 },
    );
  }
}
