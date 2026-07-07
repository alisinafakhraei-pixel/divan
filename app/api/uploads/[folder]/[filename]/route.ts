import { readBinaryFile } from "@/lib/server/github-store";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/** Streams an uploaded image straight from the GitHub repo — public/uploads/** isn't served from Vercel's static build output since that's a frozen snapshot from the last deploy. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;
  if (folder !== "people" && folder !== "startups") {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await readBinaryFile(`public/uploads/${folder}/${filename}`);
  if (!buffer) return new Response("Not found", { status: 404 });

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
