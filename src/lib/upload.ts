import { writeFile, mkdir, chmod } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { platform } from "os";

/**
 * Resolve the directory where public/uploads/ should live.
 *
 * Priority:
 * 1. MADILIK_PROJECT_ROOT env var (explicit override for VPS/PM2)
 * 2. Next.js standalone: __dirname walks up to the standalone root
 * 3. process.cwd() if it contains package.json (dev / normal start)
 * 4. Fallback to cwd
 */
function resolveProjectRoot(): string {
  const fromEnv = process.env.MADILIK_PROJECT_ROOT?.trim();
  if (fromEnv) return path.resolve(fromEnv);

  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "public"))) return cwd;
  if (existsSync(path.join(cwd, "package.json"))) return cwd;
  return cwd;
}

/** All user uploads live under public/uploads/{segment} */
const UPLOADS_ROOT = "uploads";

const ALLOWED_CANONICAL = ["image/jpeg", "image/png", "image/webp"] as const;
type CanonicalMime = (typeof ALLOWED_CANONICAL)[number];

/** Map odd client MIME strings to canonical types (mobile browsers vary). */
const MIME_ALIASES: Record<string, CanonicalMime> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

const MIME_TO_EXT: Record<CanonicalMime, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const EXT_TO_MIME: Record<string, CanonicalMime> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function resolveCanonicalMime(file: File): CanonicalMime | null {
  let raw = (file.type || "").toLowerCase().trim();
  if (raw && MIME_ALIASES[raw]) raw = MIME_ALIASES[raw];
  if (raw && ALLOWED_CANONICAL.includes(raw as CanonicalMime)) {
    return raw as CanonicalMime;
  }
  const ext = path.extname(file.name).toLowerCase();
  return EXT_TO_MIME[ext] ?? null;
}

/** Max file size (within 2–5 MB range requested) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type UploadSegment = "products" | "banners" | "categories" | "reviews";

function validateImageFile(file: File): { error: string } | null {
  const mime = resolveCanonicalMime(file);
  if (!mime) {
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

  const mime = resolveCanonicalMime(file)!;
  const ext = MIME_TO_EXT[mime];

  const base = `${namePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filename = `${base}${ext}`;

  const publicDir = path.join(resolveProjectRoot(), "public", UPLOADS_ROOT, segment);
  await mkdir(publicDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(publicDir, filename);

  await writeFile(filePath, buffer);

  if (platform() !== "win32") {
    try {
      await chmod(filePath, 0o644);
    } catch {
      /* ignore chmod issues */
    }
  }

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
