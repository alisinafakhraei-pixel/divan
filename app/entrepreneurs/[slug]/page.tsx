import { NewsCard } from "@/components/shared/news-card";
import { PersonInfoPanel } from "@/components/shared/person-info-panel";
import { PersonProfileHeader } from "@/components/shared/person-profile-header";
import { ShareButtons } from "@/components/shared/share-buttons";
import { getRelatedNews } from "@/lib/data-access/news";
import { getPersonBySlug } from "@/lib/data-access/people";
import { getStartupById } from "@/lib/data-access/startups";
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
  const person = getPersonBySlug(slug);
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) notFound();

  const knownForStartup = person.knownForStartupId ? getStartupById(person.knownForStartupId) : undefined;
  const relatedNews = getRelatedNews(person.id, 3);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <PersonProfileHeader person={person} />

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
            <Link href="/contribute" className="text-sm font-medium text-action-blue hover:underline">
              Suggest an edit
            </Link>
          </div>
        </div>

        <PersonInfoPanel person={person} />
      </div>
    </div>
  );
}
