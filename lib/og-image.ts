import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

/** Resolves a Person/Startup image field to something ImageResponse can render:
 *  remote URLs pass through as-is, local /public paths are inlined as data URIs
 *  (satori can't resolve relative paths without an absolute origin). */
export async function resolveOgImageSrc(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("http")) return src;

  const ext = path.extname(src).toLowerCase();
  const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
  const filePath = path.join(process.cwd(), "public", src);
  try {
    const buffer = await readFile(filePath);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
