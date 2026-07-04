import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import { getCohortDisplayState } from "@/lib/data-access/hackathon";
import type { HackathonCohort } from "@/lib/types";

export function CohortArchiveCard({ cohort }: { cohort: HackathonCohort }) {
  const display = getCohortDisplayState(cohort);
  const statusLabel =
    display.state === "closed" ? "Closed" : display.state === "applications-open" ? "Applications open" : "Upcoming";

  return (
    <CardShell href={`/hackathon/cohorts/${cohort.slug}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-foreground">{cohort.name}</p>
        <Badge variant={display.state === "closed" ? "secondary" : "success"}>{statusLabel}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{cohort.theme}</p>
      {display.state === "closed" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {cohort.stats.applications} applications · {cohort.stats.teams} teams · {cohort.stats.countries} countries
        </p>
      ) : null}
    </CardShell>
  );
}
