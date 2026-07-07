import { CohortHero } from "@/components/hackathon/cohort-hero";
import { MentorCard } from "@/components/shared/mentor-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsBar } from "@/components/shared/stats-bar";
import { Button } from "@/components/ui/button";
import { getCurrentCohort, getPastCohorts } from "@/lib/data-access/hackathon";
import { getPersonById } from "@/lib/data-access/people";
import Link from "next/link";

const FORMAT_STEPS = [
  { title: "Week 1 — Team up", body: "Form a team, pick a track, and get matched with a mentor." },
  { title: "Week 2 — Build", body: "Ship a working prototype with weekly mentor office hours." },
  { title: "Week 3 — Demo Day", body: "Pitch to a panel of investors and operators from the Divan network." },
];

export default async function HackathonPage() {
  const currentCohort = getCurrentCohort();
  const lastCohort = getPastCohorts()[0];
  const mentors = (await Promise.all((lastCohort?.mentorIds ?? []).map(getPersonById))).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-4 py-12 sm:px-6">
      {currentCohort ? <CohortHero cohort={currentCohort} /> : null}

      {lastCohort ? (
        <section className="space-y-4">
          <SectionHeading bold={lastCohort.name} muted="by the numbers" />
          <StatsBar
            stats={[
              { label: "Applications", value: lastCohort.stats.applications },
              { label: "Teams", value: lastCohort.stats.teams },
              { label: "Countries", value: lastCohort.stats.countries },
              { label: "Mentors", value: lastCohort.stats.mentors },
            ]}
          />
        </section>
      ) : null}

      <section id="format" className="space-y-4 scroll-mt-20">
        <SectionHeading bold="How it" muted="works" />
        <div className="grid gap-4 sm:grid-cols-3">
          {FORMAT_STEPS.map((step) => (
            <div key={step.title} className="rounded-xl border border-border p-5">
              <p className="font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {mentors.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading bold="Mentors from the" muted="Divan network" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" render={<Link href="/hackathon/cohorts" />}>
          Past cohorts
        </Button>
      </div>
    </div>
  );
}
