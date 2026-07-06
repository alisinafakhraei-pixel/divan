import { EmptyState } from "@/components/shared/empty-state";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { NewsCard } from "@/components/shared/news-card";
import { PersonCard } from "@/components/shared/person-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StartupCard } from "@/components/shared/startup-card";
import { getNews } from "@/lib/data-access/news";
import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const people = q ? getPeople({ search: q }) : [];
  const startups = q ? getStartups({ search: q }) : [];
  const news = q ? getNews({ search: q }) : [];
  const totalResults = people.length + startups.length + news.length;

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 px-4 py-12 sm:px-6">
      <SectionHeading as="h1" bold="Search" muted={q ? `results for "${q}"` : ""} />

      <HeroSearchBar defaultValue={q} />

      {!q || totalResults === 0 ? (
        <EmptyState
          title={q ? "No results found" : "Start typing to search"}
          description={q ? "Try a different name or keyword." : "Search across entrepreneurs, startups, and news."}
        />
      ) : (
        <>
          {people.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Entrepreneurs ({people.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          ) : null}

          {startups.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Startups ({startups.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {startups.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            </section>
          ) : null}

          {news.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                News ({news.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
