import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { SegmentBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Person } from "@/lib/types";

export function PersonCard({ person }: { person: Person }) {
  return (
    <CardShell href={`/entrepreneurs/${person.slug}`}>
      <EntityAvatar name={person.name} image={person.picture} className="size-14 sm:size-24" />
      <div className="mt-4">
        <p className="font-semibold text-foreground">{person.name}</p>
        <p className="text-sm text-muted-foreground">{person.title}</p>
        <p className="mt-1 text-sm text-foreground">{person.knownFor}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <SegmentBadge segment={person.segment} />
        <Badge variant="secondary">{person.country}</Badge>
      </div>
    </CardShell>
  );
}
