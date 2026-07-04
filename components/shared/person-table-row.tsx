import { EntityAvatar } from "@/components/shared/entity-avatar";
import { SegmentBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Person } from "@/lib/types";
import Link from "next/link";

export function PersonTableRow({ person }: { person: Person }) {
  return (
    <Link
      href={`/entrepreneurs/${person.slug}`}
      className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-border px-2 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
    >
      <EntityAvatar name={person.name} image={person.picture} size="sm" />
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{person.name}</p>
        <p className="truncate text-xs text-muted-foreground">{person.knownFor}</p>
      </div>
      <span className="hidden text-muted-foreground sm:inline">{person.title}</span>
      <SegmentBadge segment={person.segment} />
      <Badge variant="secondary">{person.country}</Badge>
    </Link>
  );
}
