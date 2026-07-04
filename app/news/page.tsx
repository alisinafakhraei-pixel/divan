import { EmptyState } from "@/components/shared/empty-state";
import { NewsCard } from "@/components/shared/news-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { UrlPagination } from "@/components/shared/url-pagination";
import { NewsToolbar } from "@/components/news/news-toolbar";
import { Button } from "@/components/ui/button";
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

  const results = getNews({
    search: params.q,
    type: params.type as NewsType | undefined,
  });

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading
          as="h1"
          bold="News &"
          muted="discover"
          subhead="Funding announcements, articles, and podcasts from across the Divan network."
        />
        <Button variant="outline" render={<Link href="/contribute" />} className="shrink-0">
          Submit news
        </Button>
      </div>

      <NewsToolbar types={getNewsTypes()} />

      {pageItems.length === 0 ? (
        <EmptyState title="No news found" description="Try adjusting your filters or search terms." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <UrlPagination pageCount={pageCount} />
    </div>
  );
}
