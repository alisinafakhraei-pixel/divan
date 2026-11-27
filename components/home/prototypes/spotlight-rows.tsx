import { FaceCard } from "@/components/news/showcase";
import { HackathonStrip, MapAndContribute, hackathonHeadline } from "@/components/home/prototypes/common";
import { ScrollRow } from "@/components/home/prototypes/scroll-row";
import { Spotlight, type Slide } from "@/components/home/prototypes/spotlight";
import type { HomeData } from "@/components/home/prototypes/types";
import { whenLabel } from "@/components/home/whats-new/shared";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { NewsCard } from "@/components/shared/news-card";
import { PersonCard } from "@/components/shared/person-card";
import { StartupCard } from "@/components/shared/startup-card";
import { newsToActivity, todayInToronto } from "@/lib/data-access/activity";
import { hackathon2026 as hackathon } from "@/lib/data/hackathon-2026";

/** Design 3, "Spotlight + rows": a rotating spotlight you can steer, then sideways-scrolling rows to browse, streaming-style. */
export function HomeSpotlightRows({ data }: { data: HomeData }) {
  const today = todayInToronto();
  const lead = data.news.slice(0, 8).find((n) => n.image) ?? data.news[0];
  const leadItem = lead ? newsToActivity(lead, today) : undefined;
  const newPerson = data.feed.all.find((i) => i.kind === "person");
  const featured = data.featuredPeople.find((p) => p.id !== newPerson?.id) ?? data.featuredPeople[0];
  const startup = data.featuredStartups[0];
  const hack = hackathonHeadline();

  const slides: Slide[] = [
    ...(leadItem ? [{ key: "story", label: "Top story", title: leadItem.title, blurb: leadItem.blurb, meta: `${leadItem.source} · ${whenLabel(leadItem)}`, href: leadItem.href, cta: "Read the story", style: "story" as const, image: leadItem.image }] : []),
    ...(newPerson ? [{ key: "new", label: "New to Divan", title: newPerson.title, blurb: newPerson.blurb, meta: `${newPerson.subtitle}${newPerson.source ? ` · found in ${newPerson.source}` : ""}`, href: newPerson.href, cta: "See the profile", style: "profile" as const, image: newPerson.image, name: newPerson.title }] : []),
    ...(featured ? [{ key: "featured", label: "Featured entrepreneur", title: featured.name, blurb: featured.bio, meta: `${featured.title} · ${featured.knownFor}`, href: `/entrepreneurs/${featured.slug}`, cta: "See the profile", style: "profile" as const, image: featured.picture, name: featured.name }] : []),
    ...(startup ? [{ key: "startup", label: "Startup to watch", title: startup.name, blurb: startup.tagline, meta: `${startup.mainCategory} · ${startup.hqCountry}`, href: `/startups/${startup.slug}`, cta: "See the startup", style: "brand" as const }] : []),
    { key: "hack", label: "Hackathon", title: hack.title, blurb: hack.text, href: hackathon.siteUrl, cta: "Follow the program", external: true, style: "brand" as const },
  ];
  const faces = data.feed.all.filter((i) => i.kind === "person" || i.kind === "startup");

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="max-w-xl text-3xl leading-[1.05] font-extrabold tracking-tight text-foreground sm:text-5xl">
            Meet Iranian <span className="font-normal text-muted-foreground">entrepreneurs of the world.</span>
          </h1>
          <div className="w-full max-w-md">
            <HeroSearchBar />
          </div>
        </div>
        <Spotlight slides={slides} />
      </section>

      <ScrollRow title="Fresh stories" hint="Found and checked by Divan AI." href="/news" cta="All news">
        {data.news.slice(0, 8).map((item) => (
          <div key={item.id} className="w-72 shrink-0 snap-start">
            <NewsCard item={item} />
          </div>
        ))}
      </ScrollRow>

      {faces.length > 0 ? (
        <ScrollRow title="New faces" hint="People and companies added from the news this week." href="/entrepreneurs" cta="Browse everyone">
          {faces.map((item) => (
            <FaceCard key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </ScrollRow>
      ) : null}

      <ScrollRow title="Featured entrepreneurs" href="/entrepreneurs">
        {data.featuredPeople.map((person) => (
          <div key={person.id} className="w-64 shrink-0 snap-start">
            <PersonCard person={person} vouchCount={data.vouchCounts[person.id]} />
          </div>
        ))}
      </ScrollRow>

      <ScrollRow title="Startups to watch" href="/startups">
        {data.featuredStartups.map((startup) => (
          <div key={startup.id} className="w-72 shrink-0 snap-start">
            <StartupCard startup={startup} />
          </div>
        ))}
      </ScrollRow>

      <HackathonStrip />
      <MapAndContribute data={data} />
    </div>
  );
}
