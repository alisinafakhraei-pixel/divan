import { extractEntities } from "@/lib/server/entity-extractor";
import { curateNews, fetchArticle } from "@/lib/server/news-curator";
import { readAutoNews, writeAutoNews } from "@/lib/server/news-store";
import { NextResponse } from "next/server";

// Gemini's grounded search is slow (~1 min), then the job opens every candidate article and reads each one for people and companies.
export const maxDuration = 300;

// Vercel Cron calls this once a day (see vercel.json) with `Authorization: Bearer $CRON_SECRET`.
// Locally, call it by hand: `curl localhost:3001/api/cron/news`.
//   ?dry=1       preview the news without saving
//   ?images=1    fill in missing preview images on saved stories
//   ?entities=1  skip the news search; just read the recent saved stories for new people and companies
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

  const params = new URL(request.url).searchParams;
  const dry = params.get("dry") === "1";

  try {
    const existing = await readAutoNews();

    if (params.get("images") === "1") {
      let filled = 0;
      for (const item of existing) {
        if (item.image) continue;
        const page = await fetchArticle(item.link);
        if (page.ok && page.image) {
          item.image = page.image;
          filled += 1;
        }
      }
      if (filled > 0) await writeAutoNews(existing);
      return NextResponse.json({ imagesAdded: filled, of: existing.length });
    }

    if (params.get("entities") === "1") {
      const recent = existing.slice(0, 8);
      return NextResponse.json({ entities: dry ? "skipped (dry run)" : await extractEntities(recent) });
    }

    const report = await curateNews(existing);
    if (!dry && report.added.length > 0) await writeAutoNews([...report.added, ...existing]);

    // Entities are read from the stories that passed verification, never from the model's memory.
    let entities = null;
    if (!dry && report.added.length > 0) {
      try {
        entities = await extractEntities(report.added);
      } catch (error) {
        console.error("Entity extraction failed", error);
        entities = { error: error instanceof Error ? error.message : "Entity extraction failed" };
      }
    }

    return NextResponse.json({
      dryRun: dry,
      candidates: report.candidates,
      added: report.added.map((n) => ({ title: n.title, source: n.sourceName, link: n.link, date: n.date })),
      rejected: report.rejected,
      entities,
    });
  } catch (error) {
    console.error("News curation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Curation failed" }, { status: 500 });
  }
}
