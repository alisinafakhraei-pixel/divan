import { FaceCard, LeadStory, SectionLabel, StoryRow } from "@/components/news/showcase";
import { FeaturedPeople, FeaturedStartups, HackathonStrip, MapAndContribute } from "@/components/home/prototypes/common";
import type { HomeData } from "@/components/home/prototypes/types";
import { KIND_META, LiveDot, whenLabel } from "@/components/home/whats-new/shared";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { StatsBar } from "@/components/shared/stats-bar";
import { newsToActivity, todayInToronto } from "@/lib/data-access/activity";
import Link from "next/link";

/** Design 1, "Front page": the homepage is the news page. A short masthead, a "just in" strip, top stories, new faces, then the directory. */
export function HomeFrontPage({ data }: { data: HomeData }) {
  const today = todayInToronto();
  const lead = data.news.slice(0, 8).find((n) => n.image) ?? data.news[0];
  const side = data.news.filter((n) => n !== lead).slice(0, 3);
  const faces = data.feed.all.filter((i) => i.kind === "person" || i.kind === "startup");
  const justIn = data.feed.all.slice(0, 4);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div className="space-y-3">
          <h1 className="text-4xl leading-[1.02] font-extrabold tracking-tight text-foreground sm:text-6xl">
            Meet Iranian <span className="font-normal text-muted-foreground">entrepreneurs of the world.</span>
          </h1>
          <p className="max-w-lg text-muted-foreground">Founders, startups and the news that follows them. Updated every day.</p>
        </div>
        <div className="space-y-5">
          <HeroSearchBar />
          <StatsBar stats={data.heroStats} />
        </div>
      </section>

      {justIn.length > 0 ? (
        <section className="-mt-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-muted/40 px-4 py-3">
          <span className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-wide text-foreground uppercase">
            <LiveDot /> Just in
          </span>
          <ul className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {justIn.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <Link href={item.href} className="inline-flex items-center gap-2 text-sm text-foreground hover:underline">
                  <span className={`inline-flex size-5 items-center justify-center rounded-full ${KIND_META[item.kind].tint}`}>
                    {(() => {
                      const Icon = KIND_META[item.kind].icon;
                      return <Icon className="size-3" />;
                    })()}
                  </span>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{whenLabel(item)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lead ? (
        <section className="space-y-4">
          <SectionLabel title="Top stories" hint="Found and checked by Divan AI every day." href="/news" cta="All news" />
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <LeadStory item={newsToActivity(lead, today)} />
            <div className="flex flex-col gap-3">
              {side.map((n) => (
                <StoryRow key={n.id} item={newsToActivity(n, today)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faces.length > 0 ? (
        <section className="space-y-4">
          <SectionLabel title="New faces" hint="People and companies Divan found in the news this week." href="/entrepreneurs" cta="Browse everyone" />
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {faces.map((item) => (
              <FaceCard key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <HackathonStrip />
      <FeaturedPeople data={data} />
      <FeaturedStartups data={data} />
      <MapAndContribute data={data} />
    </div>
  );
}
