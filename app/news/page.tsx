import { NewsToolbar } from "@/components/news/news-toolbar";
import { FaceCard, LeadStory, SectionLabel, StoryRow } from "@/components/news/showcase";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsCard } from "@/components/shared/news-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { getActivityFeed, newsToActivity, todayInToronto } from "@/lib/data-access/activity";
import { getNews, getNewsTypes } from "@/lib/data-access/news";
import type { NewsType } from "@/lib/types";
import Link from "next/link";

const PAGE_SIZE = 8;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  const [results, types, feed] = await Promise.all([
    getNews({ search: params.q, type: params.type as NewsType | undefined }),
    getNewsTypes(),
    getActivityFeed(),
  ]);

  // Without a search or filter, the top stories live in the showcase above the list (first page only), so the list below never repeats them.
  const plain = !params.q && !params.type && results.length > 0;
  const today = todayInToronto();
  const lead = plain ? (results.slice(0, 8).find((n) => n.image) ?? results[0]) : undefined;
  const side = plain ? results.filter((n) => n !== lead).slice(0, 3) : [];
  const rest = plain ? results.filter((n) => n !== lead && !side.includes(n)) : results;
  const showcase = plain && page === 1;
  const faces = showcase ? feed.all.filter((i) => i.kind === "person" || i.kind === "startup") : [];

  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading
          as="h1"
          bold="News &"
          muted="discover"
          subhead="Stories about Iranian entrepreneurs around the world. Divan's AI finds and checks new ones every day, and the community adds more."
        />
        <Button variant="outline" render={<Link href="/contribute" />} className="shrink-0">
          Submit news
        </Button>
      </div>

      <NewsToolbar types={types} />

      {showcase && lead ? (
        <div className="space-y-4">
          <SectionLabel title="Top stories" hint="The latest, checked against their sources." />
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <LeadStory item={newsToActivity(lead, today)} />
            <div className="flex flex-col gap-3">
              {side.map((n) => (
                <StoryRow key={n.id} item={newsToActivity(n, today)} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {faces.length > 0 ? (
        <div className="space-y-4">
          <SectionLabel
            title="New faces"
            hint="People and companies Divan found in the news recently."
            href="/entrepreneurs"
            cta="Browse everyone"
          />
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {faces.map((item) => (
              <FaceCard key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      {results.length === 0 ? (
        <EmptyState title="No news found" description="Try adjusting your filters or search terms." />
      ) : rest.length > 0 ? (
        <div className="space-y-4">
          {showcase ? <SectionLabel title="All stories" hint="Everything we've collected, newest first." /> : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      <UrlPagination pageCount={pageCount} />
    </div>
  );
}
