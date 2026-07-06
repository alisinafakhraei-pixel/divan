import { EntityAvatar } from "@/components/shared/entity-avatar";
import { SegmentBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Person } from "@/lib/types";

export function PersonProfileHeader({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <EntityAvatar name={person.name} image={person.picture} size="lg" className="!size-28 sm:!size-36" />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {person.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {person.title} · {person.knownFor}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <SegmentBadge segment={person.segment} />
          <Badge variant="secondary">{person.country}</Badge>
        </div>
      </div>
    </div>
  );
}
