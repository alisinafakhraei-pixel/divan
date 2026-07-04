import { PersonCard } from "@/components/shared/person-card";
import type { Person } from "@/lib/types";

/** Horizontally scrollable row — the boxy/minimal alternative to a heavier carousel widget. */
export function FeaturedCarousel({ people }: { people: Person[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
      {people.map((person) => (
        <div key={person.id} className="w-64 shrink-0">
          <PersonCard person={person} />
        </div>
      ))}
    </div>
  );
}
