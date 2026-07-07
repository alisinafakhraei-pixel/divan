import { writeBinaryFile } from "@/lib/server/github-store";

function extensionFromMime(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

/** Commits an uploaded image into this repo (public/uploads/...) via the GitHub API — GitHub is the database, including pictures. */
export async function saveUploadedImage(file: File, folder: "people" | "startups", id: string): Promise<string> {
  const filename = `${id}.${extensionFromMime(file.type)}`;
  const path = `public/uploads/${folder}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeBinaryFile(path, buffer, `Upload ${folder} image: ${filename}`);
  // Served dynamically from GitHub (not /public) — a static /public URL wouldn't update until the next
  // deploy, since Vercel's filesystem is a frozen build snapshot.
  return `/api/uploads/${folder}/${filename}`;
}
