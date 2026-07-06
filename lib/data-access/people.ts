import { people } from "@/lib/data/people";
import { getStartupById } from "@/lib/data-access/startups";
import type { Person, Segment } from "@/lib/types";

// Reads fixtures today; signatures match what a real Formaloo/DB call would take.
// Pages/components should only ever import from data-access, never lib/data directly.

export interface PeopleFilters {
  country?: string;
  segment?: Segment;
  industry?: string;
  search?: string;
}

export type PeopleSort = "name-asc" | "recent" | "most-viewed";

/** A person's "industry" is derived from their known-for startup — Person itself carries no industry field. */
function personIndustries(person: Person): string[] {
  const startup = person.knownForStartupId ? getStartupById(person.knownForStartupId) : undefined;
  return startup?.industries ?? [];
}

export function getPeople(filters?: PeopleFilters, sort: PeopleSort = "name-asc"): Person[] {
  let result = [...people];

  if (filters?.country) {
    result = result.filter((p) => p.country === filters.country);
  }
  if (filters?.segment) {
    result = result.filter((p) => p.segment === filters.segment);
  }
  if (filters?.industry) {
    result = result.filter((p) => personIndustries(p).includes(filters.industry!));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.knownFor.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    );
  }

  if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
  // Fixture array order stands in for "date added" — newest-added last, so reverse it.
  if (sort === "recent") result.reverse();
  if (sort === "most-viewed") result.sort((a, b) => b.viewCount - a.viewCount);

  return result;
}

export function getPersonBySlug(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}

export function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

export function getFeaturedPeople(limit = 6): Person[] {
  // Farokh is pinned first among featured entrepreneurs on the homepage.
  return people
    .filter((p) => p.featured)
    .sort((a, b) => (a.slug === "farokh-shahabi" ? -1 : b.slug === "farokh-shahabi" ? 1 : 0))
    .slice(0, limit);
}

export function getPeopleCount(): number {
  return people.length;
}

export function getPeopleCountries(): string[] {
  return Array.from(new Set(people.map((p) => p.country))).sort();
}

export function getPeopleSegments(): Segment[] {
  return Array.from(new Set(people.map((p) => p.segment)));
}

export function getPeopleIndustries(): string[] {
  return Array.from(new Set(people.flatMap((p) => personIndustries(p)))).sort();
}
