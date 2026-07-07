import { SuggestEditSheet } from "@/components/contribute/suggest-edit-sheet";
import { getStartupFields, startupToFieldValues } from "@/components/contribute/suggest-form-fields";
import { FounderLinks } from "@/components/shared/founder-links";
import { NewsCard } from "@/components/shared/news-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { StartupInfoPanel } from "@/components/shared/startup-info-panel";
import { StartupProfileHeader } from "@/components/shared/startup-profile-header";
import { getPersonById } from "@/lib/data-access/people";
import { getRelatedNews } from "@/lib/data-access/news";
import { getStartupBySlug } from "@/lib/data-access/startups";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const startup = getStartupBySlug(slug);
  if (!startup) return {};

  const title = `${startup.name} | Divan`;
  const description = startup.tagline;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function StartupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const startup = getStartupBySlug(slug);
  if (!startup) notFound();

  const relatedNews = getRelatedNews(startup.id, 3);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <StartupProfileHeader startup={startup} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              About
            </h2>
            <p className="text-foreground">{startup.notes}</p>
          </div>

          <FounderLinks founderIds={startup.founderIds} />

          {relatedNews.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Related news
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-border pt-6">
            <ShareButtons title={startup.name} />
            <SuggestEditSheet
              fields={getStartupFields()}
              kind="startup"
              targetId={startup.id}
              defaultValues={startupToFieldValues(
                startup,
                startup.founderIds.map((id) => getPersonById(id)?.name).filter((name): name is string => Boolean(name))
              )}
              submitLabel="Submit edit"
            />
          </div>
        </div>

        <StartupInfoPanel startup={startup} />
      </div>
    </div>
  );
}
