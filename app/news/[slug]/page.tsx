import { NewsInfoPanel } from "@/components/shared/news-info-panel";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNewsBySlug } from "@/lib/data-access/news";
import { getPersonById } from "@/lib/data-access/people";
import { getStartupById } from "@/lib/data-access/startups";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const [relatedPeopleResults, relatedStartupsResults] = await Promise.all([
    Promise.all(item.relatedEntityIds.map(getPersonById)),
    Promise.all(item.relatedEntityIds.map(getStartupById)),
  ]);
  const relatedPeople = relatedPeopleResults.filter((p): p is NonNullable<typeof p> => Boolean(p));
  const relatedStartups = relatedStartupsResults.filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{item.type}</Badge>
          <span className="text-sm text-muted-foreground">{item.date}</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {item.title}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              TL;DR
            </h2>
            <p className="text-foreground">{item.tldr || "No summary yet — read the full piece for details."}</p>
          </div>

          <Button render={<a href={item.link} target="_blank" rel="noopener noreferrer" />}>
            Read the full {item.type.toLowerCase()}
            <ExternalLink />
          </Button>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <ShareButtons title={item.title} />
            <Link href="/contribute" className="text-sm font-medium text-action-blue hover:underline">
              Suggest an edit
            </Link>
          </div>
        </div>

        <NewsInfoPanel item={item} relatedPeople={relatedPeople} relatedStartups={relatedStartups} />
      </div>
    </div>
  );
}
