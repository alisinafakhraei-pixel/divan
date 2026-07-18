import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import type { Volunteer } from "@/lib/types";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <CardShell href={`/volunteers/${volunteer.slug}`}>
      <EntityAvatar name={volunteer.name} image={volunteer.avatar} className="size-14 sm:size-24" />
      <div className="mt-4">
        <p className="font-semibold text-foreground">{volunteer.name}</p>
        <p className="text-sm text-muted-foreground">{volunteer.role}</p>
        {volunteer.bio ? <p className="mt-1 text-sm text-foreground">{volunteer.bio}</p> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="sky">{volunteer.focusArea}</Badge>
        {volunteer.country ? <Badge variant="secondary">{volunteer.country}</Badge> : null}
      </div>
    </CardShell>
  );
}
