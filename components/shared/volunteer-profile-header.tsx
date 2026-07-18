import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import type { Volunteer } from "@/lib/types";

export function VolunteerProfileHeader({ volunteer }: { volunteer: Volunteer }) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <EntityAvatar name={volunteer.name} image={volunteer.avatar} className="size-28 sm:size-36" />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {volunteer.name}
        </h1>
        <p className="mt-1 text-muted-foreground">{volunteer.role}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="sky">{volunteer.focusArea}</Badge>
          {volunteer.country ? <Badge variant="secondary">{volunteer.country}</Badge> : null}
        </div>
      </div>
    </div>
  );
}
