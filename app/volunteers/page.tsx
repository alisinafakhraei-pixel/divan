import { SectionHeading } from "@/components/shared/section-heading";
import { VolunteerCard } from "@/components/shared/volunteer-card";
import { getVolunteers } from "@/lib/data-access/volunteers";

export default function VolunteersPage() {
  const volunteers = getVolunteers();

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Our"
        muted="volunteers"
        subhead="Divan is run in large part by volunteers who give their time to keep the community, content, and events running."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.id} volunteer={volunteer} />
        ))}
      </div>
    </div>
  );
}
