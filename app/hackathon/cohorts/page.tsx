import { CohortArchiveCard } from "@/components/hackathon/cohort-archive-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllCohorts } from "@/lib/data-access/hackathon";

export default function CohortsArchivePage() {
  const cohorts = getAllCohorts();

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading as="h1" bold="Past" muted="cohorts" subhead="Every Divan Hackathon edition, past and present." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cohorts.map((cohort) => (
          <CohortArchiveCard key={cohort.id} cohort={cohort} />
        ))}
      </div>
    </div>
  );
}
