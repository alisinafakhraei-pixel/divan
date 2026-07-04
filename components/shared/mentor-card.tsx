import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import type { Person } from "@/lib/types";

export function MentorCard({ mentor }: { mentor: Person }) {
  return (
    <CardShell href={`/entrepreneurs/${mentor.slug}`} className="flex items-center gap-3 p-4">
      <EntityAvatar name={mentor.name} image={mentor.picture} />
      <div>
        <p className="text-sm font-semibold text-foreground">{mentor.name}</p>
        <p className="text-xs text-muted-foreground">{mentor.title}</p>
      </div>
    </CardShell>
  );
}
