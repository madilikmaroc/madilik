import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function resolveUploadsRoot(): string {
  const fromEnv = process.env.MADILIK_PROJECT_ROOT?.trim();
  if (fromEnv) return path.join(path.resolve(fromEnv), "public", "uploads");

  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "public", "uploads"))) {
    return path.join(cwd, "public", "uploads");
  }
  return path.join(cwd, "public", "uploads");
}

/**
 * Serve uploaded files that Next.js can't serve from public/ after build.
 * In production, Nginx should serve /uploads/ directly for best performance;
 * this route is a reliable fallback that always works.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const joined = segments.join("/");

  // Prevent path traversal
  if (joined.includes("..") || joined.includes("\\")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const uploadsRoot = resolveUploadsRoot();
  const filePath = path.join(uploadsRoot, ...segments);
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(path.resolve(uploadsRoot))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const fileStat = await stat(resolved);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    const buffer = await readFile(resolved);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
