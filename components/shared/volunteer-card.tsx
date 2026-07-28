import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import type { Volunteer } from "@/lib/types";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <CardShell href={volunteer.socials?.linkedin}>
      <EntityAvatar name={volunteer.name} image={volunteer.avatar} className="size-14 sm:size-24" />
      <div className="mt-4">
        <p className="font-semibold text-foreground">{volunteer.name}</p>
        {volunteer.bio ? <p className="mt-1 text-sm text-foreground">{volunteer.bio}</p> : null}
      </div>
    </CardShell>
  );
}
