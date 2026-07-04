import { FeatureTile } from "@/components/shared/feature-tile";
import { Button } from "@/components/ui/button";
import { getCohortDisplayState } from "@/lib/data-access/hackathon";
import type { HackathonCohort } from "@/lib/types";
import Link from "next/link";

export function CohortHero({ cohort }: { cohort: HackathonCohort }) {
  const display = getCohortDisplayState(cohort);

  const { heading, description, ctaLabel, ctaHref } =
    display.state === "upcoming"
      ? {
          heading: `${cohort.name} starts in ${display.daysUntilOpen} days`,
          description: `Theme: ${cohort.theme}. Applications open ${cohort.applicationsOpenAt}.`,
          ctaLabel: "Learn more",
          ctaHref: "#format",
        }
      : display.state === "applications-open"
        ? {
            heading: `Applications open for ${cohort.name}`,
            description: `Theme: ${cohort.theme}. ${display.daysUntilClose} days left to apply.`,
            ctaLabel: "Apply now",
            ctaHref: "/hackathon/apply",
          }
        : {
            heading: `${cohort.name} — applications closed`,
            description: "See the recap: stats, mentors, and finalists from this cohort.",
            ctaLabel: "See recap",
            ctaHref: `/hackathon/cohorts/${cohort.slug}`,
          };

  return (
    <FeatureTile variant="ink" className="text-center sm:text-left">
      <p className="text-sm font-medium tracking-wide text-white/60 uppercase">Divan Hackathon</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h1>
      <p className="mt-3 max-w-xl text-white/70">{description}</p>
      <Button variant="accent" size="lg" className="mt-6" render={<Link href={ctaHref} />}>
        {ctaLabel}
      </Button>
    </FeatureTile>
  );
}
