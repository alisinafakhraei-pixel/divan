import { HackathonApplyButtons, HackathonStatusPill } from "@/components/home/hackathon-parts";
import type { HeroStat } from "@/components/home/hero-types";
import { DivanMark } from "@/components/shared/divan-mark";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { StatsBar } from "@/components/shared/stats-bar";
import { hackathon2026 as hackathon } from "@/lib/data/hackathon-2026";
import { Trophy } from "lucide-react";

const FACTS = [
  { label: "Starts", value: hackathon.startsShort },
  { label: "Length", value: "3 weeks" },
  { label: "Prize pool", value: `${hackathon.prizePool} ${hackathon.currency}` },
  { label: "Apply by", value: hackathon.deadlineShort },
];

/** Option A — the hackathon IS the hero; the directory search drops into a compact strip underneath. */
export function HeroTakeover({ stats }: { stats: HeroStat[] }) {
  return (
    <section className="space-y-10">
      <div className="relative isolate animate-in overflow-hidden rounded-3xl bg-[#1c54d3] px-6 py-10 text-white duration-700 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_8%,rgba(179,224,255,0.45),transparent_42%),linear-gradient(135deg,#1c54d3_0%,#0f3590_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom_left,black,transparent_65%)] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <DivanMark className="pointer-events-none absolute -right-20 -bottom-24 -z-10 size-[24rem] text-white/10 sm:-right-10 sm:size-[36rem]" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div className="min-w-0">
            <HackathonStatusPill surface="blue" />
            <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
              Divan Hackathon 2026 · Starts {hackathon.startsOn}
            </p>
            <h1 className="mt-3 text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-7xl">
              Ideas become <span className="font-normal text-white/65">possible together.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">{hackathon.description}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {hackathon.audiences.map((audience) => (
                <li
                  key={audience}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 ring-1 ring-white/20"
                >
                  {audience}
                </li>
              ))}
            </ul>

            <HackathonApplyButtons surface="blue" block className="mt-8" />
            <p className="mt-4 text-sm text-white/70">Free · Fully online · Worldwide · Ages 18+</p>
          </div>

          <aside className="hidden rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-sm lg:block">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">The 3-week journey</p>
            <ol className="mt-4 space-y-4">
              {hackathon.weeks.map((week, i) => (
                <li key={week.label} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1c54d3]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold">{week.title}</p>
                    <p className="text-sm leading-snug text-white/70">{week.short}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-white/20 pt-4">
              <p className="flex items-center gap-2 text-sm">
                <Trophy className="size-4 shrink-0 text-white/80" />
                <span className="font-bold">
                  {hackathon.prizePool} {hackathon.currency}
                </span>
                <span className="text-white/70">in prizes</span>
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {hackathon.prizes.map((prize) => (
                  <div key={prize.place} className="rounded-lg bg-white/10 py-2">
                    <dt className="text-xs text-white/70">{prize.place}</dt>
                    <dd className="text-sm font-bold">{prize.amount}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/20 pt-6 sm:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs font-medium tracking-wider text-white/60 uppercase">{fact.label}</dt>
              <dd className="mt-1 text-xl font-extrabold sm:text-2xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Meet Iranian <span className="font-normal text-muted-foreground">entrepreneurs of the world.</span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            A browsable, crowdsourced database of Iranian founders, startups, and the news that follows them.
          </p>
        </div>
        <div className="w-full max-w-lg space-y-6">
          <HeroSearchBar />
          <StatsBar stats={stats} />
        </div>
      </div>
    </section>
  );
}
