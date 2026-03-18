import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "product-images";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Save an uploaded file to public/product-images and return the public URL path.
 * Pluggable: swap this for a cloud provider (S3, Cloudinary) later.
 */
export async function uploadProductImage(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File too large. Max 5MB." };
  }

  const ext = path.extname(file.name) || ".jpg";
  const base = `product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const filename = `${base}${ext}`;

  const publicDir = path.join(process.cwd(), "public", UPLOAD_DIR);
  await mkdir(publicDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(publicDir, filename);

  await writeFile(filePath, buffer);

  return { url: `/${UPLOAD_DIR}/${filename}` };
}

const HOMEPAGE_UPLOAD_DIR = "homepage";

/**
 * Save an uploaded homepage image to public/homepage and return the public URL path.
 */
export async function uploadHomepageImage(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File too large. Max 5MB." };
  }

  const ext = path.extname(file.name) || ".jpg";
  const base = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const filename = `${base}${ext}`;

  const publicDir = path.join(process.cwd(), "public", HOMEPAGE_UPLOAD_DIR);
  await mkdir(publicDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(publicDir, filename);

  await writeFile(filePath, buffer);

  return { url: `/${HOMEPAGE_UPLOAD_DIR}/${filename}` };
}

const REVIEW_UPLOAD_DIR = "review-images";

/**
 * Save an uploaded review screenshot to public/review-images.
 */
export async function uploadReviewImage(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File too large. Max 5MB." };
  }

  const ext = path.extname(file.name) || ".jpg";
  const base = `review-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const filename = `${base}${ext}`;

  const publicDir = path.join(process.cwd(), "public", REVIEW_UPLOAD_DIR);
  await mkdir(publicDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(publicDir, filename);

  await writeFile(filePath, buffer);

  return { url: `/${REVIEW_UPLOAD_DIR}/${filename}` };
}
