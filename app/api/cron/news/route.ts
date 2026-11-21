import { curateNews } from "@/lib/server/news-curator";
import { readAutoNews, writeAutoNews } from "@/lib/server/news-store";
import { NextResponse } from "next/server";

// Gemini's grounded search is slow (~1 min) and the curator then opens every candidate article.
export const maxDuration = 300;

// Vercel Cron calls this once a day (see vercel.json) with `Authorization: Bearer $CRON_SECRET`.
// Locally, call it by hand: `curl localhost:3000/api/cron/news` (add `?dry=1` to preview without saving).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }

  // Kill switch: set NEWS_AUTOMATION_ENABLED=false to stop the feed instantly without a deploy.
  if (process.env.NEWS_AUTOMATION_ENABLED === "false") {
    return NextResponse.json({ skipped: "NEWS_AUTOMATION_ENABLED is false" });
  }

  const dry = new URL(request.url).searchParams.get("dry") === "1";

  try {
    const existing = await readAutoNews();
    const report = await curateNews(existing);
    if (!dry && report.added.length > 0) await writeAutoNews([...report.added, ...existing]);
    return NextResponse.json({
      dryRun: dry,
      candidates: report.candidates,
      added: report.added.map((n) => ({ title: n.title, source: n.sourceName, link: n.link, date: n.date })),
      rejected: report.rejected,
    });
  } catch (error) {
    console.error("News curation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Curation failed" }, { status: 500 });
  }
}
