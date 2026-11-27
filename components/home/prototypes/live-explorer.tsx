import { Explorer } from "@/components/home/prototypes/explorer";
import { FeaturedPeople, FeaturedStartups, HackathonStrip, MapAndContribute } from "@/components/home/prototypes/common";
import type { HomeData } from "@/components/home/prototypes/types";
import { LiveDot } from "@/components/home/whats-new/shared";
import { DivanMark } from "@/components/shared/divan-mark";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { SectionHeading } from "@/components/shared/section-heading";

/** Design 2, "Live explorer": a bold blue hero with live numbers, then one interactive block to browse everything new by day and type. */
export function HomeLiveExplorer({ data }: { data: HomeData }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
      <section className="relative isolate overflow-hidden rounded-3xl bg-[#1c54d3] px-6 py-10 text-white sm:px-12 sm:py-14">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_8%,rgba(179,224,255,0.4),transparent_45%),linear-gradient(135deg,#1c54d3_0%,#0f3590_100%)]" />
        <DivanMark className="pointer-events-none absolute -right-14 -bottom-20 -z-10 size-[26rem] text-white/10" />
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
            <LiveDot /> Updated every day
          </span>
          <h1 className="text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl">
            Meet Iranian entrepreneurs <span className="font-normal text-white/65">of the world.</span>
          </h1>
          <p className="max-w-xl text-lg text-white/80">Founders, startups and the news that follows them, found and checked by Divan AI.</p>
          <div className="max-w-xl rounded-2xl bg-white p-3 text-foreground shadow-lg">
            <HeroSearchBar />
          </div>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/20 pt-6 sm:grid-cols-4">
          {data.heroStats.map((stat) => (
            <div key={stat.label}>
              <dd className="text-3xl font-extrabold sm:text-4xl">{stat.value}</dd>
              <dt className="text-sm text-white/70">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6">
        <SectionHeading bold="What's" muted="new on Divan" subhead="Pick a day and a type. Everything here was found automatically and links back to its source." />
        <Explorer items={data.feed.all} />
      </section>

      <HackathonStrip />
      <FeaturedPeople data={data} />
      <FeaturedStartups data={data} />
      <MapAndContribute data={data} />
    </div>
  );
}
