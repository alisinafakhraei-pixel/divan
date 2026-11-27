import { DivanMark } from "@/components/shared/divan-mark";
import { CTABanner } from "@/components/shared/cta-banner";
import { WorldMap } from "@/components/insights/world-map";
import { PersonCard } from "@/components/shared/person-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StartupCard } from "@/components/shared/startup-card";
import { Button } from "@/components/ui/button";
import type { HomeData } from "@/components/home/prototypes/types";
import { hackathon2026 as hackathon } from "@/lib/data/hackathon-2026";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SectionHeader({ bold, muted, href }: { bold: string; muted?: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <SectionHeading bold={bold} muted={muted} />
      <Link href={href} className="shrink-0 text-sm font-medium text-action-blue hover:underline">
        View all
      </Link>
    </div>
  );
}

/** Where the hackathon stands today, in words. */
export function hackathonHeadline(now = new Date()): { title: string; text: string } {
  const started = now.getTime() >= new Date(`${hackathon.startsOn} 00:00:00`).getTime();
  const open = now.getTime() <= new Date(hackathon.applicationDeadline).getTime();
  if (started) return { title: `${hackathon.name} is underway`, text: `Three weeks, fully online, ${hackathon.prizePool} ${hackathon.currency} in prizes. Follow the program and the Demo Day.` };
  if (open) return { title: `Apply to ${hackathon.name}`, text: `Free, online and worldwide. Apply by ${hackathon.deadlineShort}. Starts ${hackathon.startsShort}.` };
  return { title: `${hackathon.name} starts ${hackathon.startsShort}`, text: `Applications are closed. See the program and the prizes.` };
}

/** One slim line for the hackathon, instead of taking over the top of the page. */
export function HackathonStrip() {
  const { title, text } = hackathonHeadline();
  return (
    <div className="relative isolate flex flex-col items-start gap-4 overflow-hidden rounded-2xl bg-[#1c54d3] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#1c54d3_0%,#0f3590_100%)]" />
      <DivanMark className="pointer-events-none absolute -right-6 -bottom-10 -z-10 size-48 text-white/10" />
      <div>
        <p className="text-lg font-extrabold">{title}</p>
        <p className="text-sm text-white/80">{text}</p>
      </div>
      <Button render={<a href={hackathon.siteUrl} target="_blank" rel="noopener noreferrer" />} className="shrink-0 bg-white text-[#1c54d3] hover:bg-white/90">
        Follow the program
        <ArrowUpRight />
      </Button>
    </div>
  );
}

export function FeaturedPeople({ data, count = 6 }: { data: HomeData; count?: number }) {
  return (
    <section className="space-y-6">
      <SectionHeader bold="Featured" muted="entrepreneurs" href="/entrepreneurs" />
      <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {data.featuredPeople.slice(0, count).map((person) => (
          <PersonCard key={person.id} person={person} vouchCount={data.vouchCounts[person.id]} />
        ))}
      </div>
    </section>
  );
}

export function FeaturedStartups({ data, count = 6 }: { data: HomeData; count?: number }) {
  return (
    <section className="space-y-6">
      <SectionHeader bold="Featured" muted="startups" href="/startups" />
      <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {data.featuredStartups.slice(0, count).map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </section>
  );
}

export function MapAndContribute({ data }: { data: HomeData }) {
  return (
    <>
      <section className="space-y-6">
        <SectionHeading bold="Global" muted="reach, at a glance" />
        <WorldMap people={data.allPeople} startups={data.allStartups} />
      </section>
      <CTABanner
        heading="Know someone who should be here?"
        description="Suggest an entrepreneur, startup, or news item for the Divan directory."
        ctaLabel="Contribute"
        ctaHref="/contribute"
        variant="ink"
      />
    </>
  );
}
