import { MentorCard } from "@/components/shared/mentor-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsBar } from "@/components/shared/stats-bar";
import { Badge } from "@/components/ui/badge";
import { getCohortBySlug, getCohortDisplayState } from "@/lib/data-access/hackathon";
import { getPersonById } from "@/lib/data-access/people";
import { notFound } from "next/navigation";

export default async function CohortRecapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cohort = getCohortBySlug(slug);
  if (!cohort) notFound();

  const display = getCohortDisplayState(cohort);
  const mentors = (await Promise.all(cohort.mentorIds.map(getPersonById))).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div>
        <Badge variant={display.state === "closed" ? "secondary" : "success"}>
          {display.state === "closed" ? "Closed" : display.state === "applications-open" ? "Applications open" : "Upcoming"}
        </Badge>
        <SectionHeading as="h1" bold={cohort.name} muted={cohort.theme} className="mt-3" />
      </div>

      <StatsBar
        stats={[
          { label: "Applications", value: cohort.stats.applications },
          { label: "Teams", value: cohort.stats.teams },
          { label: "Countries", value: cohort.stats.countries },
          { label: "Mentors", value: cohort.stats.mentors },
        ]}
      />

      {cohort.recapWriteup ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Recap</h2>
          <p className="text-foreground">{cohort.recapWriteup}</p>
        </div>
      ) : null}

      {cohort.videoEmbeds ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Workshop &amp; Demo Day videos
          </h2>
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Video embeds go here once recordings are published.
          </div>
        </div>
      ) : null}

      {cohort.finalists && cohort.finalists.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Finalists</h2>
          <div className="flex flex-wrap gap-2">
            {cohort.finalists.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {mentors.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Mentors</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
