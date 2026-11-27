import { SuggestEditSheet } from "@/components/contribute/suggest-edit-sheet";
import { getPersonFields, personToFieldValues } from "@/components/contribute/suggest-form-fields";
import { AutoAddedNote } from "@/components/shared/auto-added-note";
import { NewsCard } from "@/components/shared/news-card";
import { PersonInfoPanel } from "@/components/shared/person-info-panel";
import { PersonProfileHeader } from "@/components/shared/person-profile-header";
import { ShareButtons } from "@/components/shared/share-buttons";
import { getRelatedNews } from "@/lib/data-access/news";
import { getPersonBySlug } from "@/lib/data-access/people";
import { getStartupById, getStartups } from "@/lib/data-access/startups";
import { VOUCHES_ENABLED } from "@/lib/features";
import { getPublicVouches } from "@/lib/data-access/vouches";
import { VouchList } from "@/components/vouches/vouch-list";
import { VouchSheet } from "@/components/vouches/vouch-sheet";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) return {};

  const title = `${person.name} - ${person.knownFor} | Divan`;
  const description = `${person.title} at ${person.knownFor}. ${person.bio}`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function PersonDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ vouch?: string }>;
}) {
  const { slug } = await params;
  const { vouch } = await searchParams;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  const [knownForStartup, companyOptions] = await Promise.all([
    person.knownForStartupId ? getStartupById(person.knownForStartupId) : undefined,
    getStartups().then((startups) => startups.map((s) => s.name)),
  ]);
  const [relatedNews, vouches] = await Promise.all([getRelatedNews(person.id, 3), getPublicVouches(person.id)]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <PersonProfileHeader person={person} vouchCount={vouches.length} />

      {knownForStartup ? (
        <Link
          href={`/startups/${knownForStartup.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-action-blue hover:underline"
        >
          View {knownForStartup.name}'s startup profile
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              About
            </h2>
            <p className="text-foreground">{person.bio}</p>
          </div>

          {person.auto ? <AutoAddedNote sourceName={person.sourceName} sourceUrl={person.sourceUrl} /> : null}

          {VOUCHES_ENABLED ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Vouched by {vouches.length > 0 ? vouches.length : ""}
              </h2>
              <VouchSheet personId={person.id} personName={person.name} defaultOpen={vouch === "1"} />
            </div>
            {vouches.length > 0 ? (
              <VouchList vouches={vouches} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No vouches yet. Know {person.name.split(" ")[0]}? Be the first to back them.
              </p>
            )}
          </div>
          ) : null}

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
            <ShareButtons title={person.name} />
            <SuggestEditSheet
              fields={getPersonFields(companyOptions)}
              kind="person"
              targetId={person.id}
              defaultValues={personToFieldValues(person)}
              submitLabel="Submit edit"
            />
          </div>
        </div>

        <PersonInfoPanel person={person} />
      </div>
    </div>
  );
}
