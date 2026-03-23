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

/** Max file size for images (JPEG / PNG / WebP) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Max product video size — keep under Next `proxyClientMaxBodySize` (25mb). */
export const MAX_PRODUCT_VIDEO_BYTES = 24 * 1024 * 1024;

const ALLOWED_VIDEO_CANONICAL = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;
type VideoCanonicalMime = (typeof ALLOWED_VIDEO_CANONICAL)[number];

const VIDEO_MIME_ALIASES: Record<string, VideoCanonicalMime> = {
  "video/x-quicktime": "video/quicktime",
};

const VIDEO_MIME_TO_EXT: Record<VideoCanonicalMime, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const VIDEO_EXT_TO_MIME: Record<string, VideoCanonicalMime> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

function resolveCanonicalVideoMime(file: File): VideoCanonicalMime | null {
  let raw = (file.type || "").toLowerCase().trim();
  if (raw && VIDEO_MIME_ALIASES[raw]) raw = VIDEO_MIME_ALIASES[raw];
  if (raw && ALLOWED_VIDEO_CANONICAL.includes(raw as VideoCanonicalMime)) {
    return raw as VideoCanonicalMime;
  }
  const ext = path.extname(file.name).toLowerCase();
  return VIDEO_EXT_TO_MIME[ext] ?? null;
}

function validateProductVideoFile(file: File): { error: string } | null {
  const mime = resolveCanonicalVideoMime(file);
  if (!mime) {
    return {
      error: "Invalid video type. Use MP4, WebM, or MOV.",
    };
  }
  if (file.size > MAX_PRODUCT_VIDEO_BYTES) {
    return { error: "Video too large. Maximum size is 24MB." };
  }
  if (file.size < 1) {
    return { error: "File is empty." };
  }
  return null;
}

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

async function saveUploadVideo(
  file: File,
  segment: UploadSegment,
  namePrefix: string,
): Promise<{ url: string } | { error: string }> {
  const invalid = validateProductVideoFile(file);
  if (invalid) return invalid;

  const mime = resolveCanonicalVideoMime(file)!;
  const ext = VIDEO_MIME_TO_EXT[mime];

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

/** Product gallery: JPEG, PNG, WebP (5MB max) or MP4 / WebM / MOV (24MB max). */
export async function uploadProductMedia(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (resolveCanonicalMime(file)) {
    return saveUploadImage(file, "products", "product");
  }
  if (resolveCanonicalVideoMime(file)) {
    return saveUploadVideo(file, "products", "product");
  }
  return {
    error:
      "Invalid file type. Use an image (JPEG, PNG, WebP) or video (MP4, WebM, MOV).",
  };
}

export async function uploadProductImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  return uploadProductMedia(file);
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
