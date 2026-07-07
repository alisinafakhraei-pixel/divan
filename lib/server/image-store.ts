import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

function extensionFromMime(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

/** Saves an uploaded image into this repo (public/uploads/...) so it's tracked the same way as the JSON data — GitHub is the database, including pictures. */
export async function saveUploadedImage(file: File, folder: "people" | "startups", id: string): Promise<string> {
  const dir = join(UPLOADS_DIR, folder);
  mkdirSync(dir, { recursive: true });
  const filename = `${id}.${extensionFromMime(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(dir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}
