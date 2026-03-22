import { writeFile, mkdir } from "fs/promises";
import path from "path";

/** All user uploads live under public/uploads/{segment} */
const UPLOADS_ROOT = "uploads";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MIME_TO_EXT: Record<(typeof ALLOWED_TYPES)[number], string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/** Max file size (within 2–5 MB range requested) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type UploadSegment = "products" | "banners" | "categories" | "reviews";

function validateImageFile(file: File): { error: string } | null {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return { error: "Invalid file type. Use JPEG, PNG, or WebP only." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File too large. Maximum size is 5MB." };
  }
  if (file.size < 1) {
    return { error: "File is empty." };
  }
  return null;
}

/**
 * Save an image under public/uploads/{segment}/ and return public path /uploads/{segment}/filename
 */
export async function saveUploadImage(
  file: File,
  segment: UploadSegment,
  namePrefix: string,
): Promise<{ url: string } | { error: string }> {
  const invalid = validateImageFile(file);
  if (invalid) return invalid;

  const mime = file.type as (typeof ALLOWED_TYPES)[number];
  const ext = MIME_TO_EXT[mime];

  const base = `${namePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filename = `${base}${ext}`;

  const publicDir = path.join(process.cwd(), "public", UPLOADS_ROOT, segment);
  await mkdir(publicDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(publicDir, filename);

  await writeFile(filePath, buffer);

  return { url: `/${UPLOADS_ROOT}/${segment}/${filename}` };
}

export async function uploadProductImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  return saveUploadImage(file, "products", "product");
}

export async function uploadHomepageImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  return saveUploadImage(file, "banners", "banner");
}

export async function uploadCategoryImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  return saveUploadImage(file, "categories", "category");
}

export async function uploadReviewImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  return saveUploadImage(file, "reviews", "review");
}
