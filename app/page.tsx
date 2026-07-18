import { CTABanner } from "@/components/shared/cta-banner";
import { EventCard } from "@/components/shared/event-card";
import { HackathonPromoBanner } from "@/components/shared/hackathon-promo-banner";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { WorldMap } from "@/components/insights/world-map";
import { PersonCard } from "@/components/shared/person-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StartupCard } from "@/components/shared/startup-card";
import { StatsBar } from "@/components/shared/stats-bar";
import { getSiteStats } from "@/lib/data-access/stats";
import { getUpcomingEvents } from "@/lib/data-access/events";
import { getFeaturedPeople, getPeople } from "@/lib/data-access/people";
import { getFeaturedStartups, getStartups } from "@/lib/data-access/startups";
import Link from "next/link";

function SectionHeader({
  bold,
  muted,
  href,
}: {
  bold: string;
  muted?: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <SectionHeading bold={bold} muted={muted} />
      <Link href={href} className="shrink-0 text-sm font-medium text-action-blue hover:underline">
        View all
      </Link>
    </div>
  );
}

export default async function Home() {
  const [stats, featuredPeople, featuredStartups, upcomingEvents, allPeople, allStartups] = await Promise.all([
    getSiteStats(),
    getFeaturedPeople(9),
    getFeaturedStartups(6),
    getUpcomingEvents(3),
    getPeople(),
    getStartups(),
  ]);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col items-start gap-6 py-8 sm:py-12">
        <SectionHeading
          as="h1"
          bold="Meet Iranian"
          muted="entrepreneurs of the world."
          subhead="A browsable, crowdsourced database of Iranian founders, startups, and the news that follows them."
        />
        <HeroSearchBar />
        <StatsBar
          className="w-full max-w-lg pt-4"
          stats={[
            { label: "Entrepreneurs", value: stats.totalEntrepreneurs },
            { label: "Startups", value: stats.totalStartups },
            { label: "Countries", value: stats.countriesRepresented },
            { label: "Tracked valuation", value: stats.combinedTrackedValuation },
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeader bold="Featured" muted="entrepreneurs" href="/entrepreneurs" />
        <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {featuredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader bold="Featured" muted="startups" href="/startups" />
        <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {featuredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      <section>
        <HackathonPromoBanner />
      </section>

      <section className="space-y-6">
        <SectionHeader bold="Upcoming" muted="events" href="/events" />
        <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <CTABanner
        heading="Know someone who should be here?"
        description="Suggest an entrepreneur, startup, or news item for the Divan directory."
        ctaLabel="Contribute"
        ctaHref="/contribute"
        variant="ink"
      />

      <section className="space-y-6">
        <SectionHeading bold="Global" muted="reach, at a glance" />
        <WorldMap people={allPeople} startups={allStartups} />
      </section>
    </div>
  );
}
