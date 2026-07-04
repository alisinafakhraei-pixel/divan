import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  // Locally-posted jobs aren't persisted anywhere a detail route could look them up.
  const isLocal = job.slug.startsWith("local-");

  return (
    <CardShell href={isLocal ? undefined : `/community/jobs/${job.slug}`}>
      <div className="flex items-start gap-3">
        <EntityAvatar name={job.companyName} image={job.companyLogo} square />
        <div>
          <p className="font-semibold text-foreground">{job.title}</p>
          <p className="text-sm text-muted-foreground">
            {job.companyName} · {job.location}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{job.type}</Badge>
        <Badge variant="secondary">{job.category}</Badge>
      </div>
    </CardShell>
  );
}
