import { readPeople, writePeople } from "@/lib/data/people";
import { getStartupById } from "@/lib/data-access/startups";
import type { Person, Segment } from "@/lib/types";

// Backed by data/people.json via the GitHub API (this repo is the database). Signatures match what a real Formaloo/DB call would take.
// Pages/components should only ever import from data-access, never lib/data directly.

export interface PeopleFilters {
  country?: string;
  segment?: Segment;
  industry?: string;
  search?: string;
}

export type PeopleSort = "name-asc" | "recent" | "most-viewed";

/** A person's "industry" is derived from their known-for startup — Person itself carries no industry field. */
async function personIndustries(person: Person): Promise<string[]> {
  const startup = person.knownForStartupId ? await getStartupById(person.knownForStartupId) : undefined;
  return startup?.industries ?? [];
}

export async function getPeople(filters?: PeopleFilters, sort: PeopleSort = "name-asc"): Promise<Person[]> {
  let result = await readPeople();

  if (filters?.country) {
    result = result.filter((p) => p.country === filters.country);
  }
  if (filters?.segment) {
    result = result.filter((p) => p.segment === filters.segment);
  }
  if (filters?.industry) {
    const matches = await Promise.all(result.map(async (p) => (await personIndustries(p)).includes(filters.industry!)));
    result = result.filter((_, i) => matches[i]);
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

export async function getPersonBySlug(slug: string): Promise<Person | undefined> {
  return (await readPeople()).find((p) => p.slug === slug);
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  return (await readPeople()).find((p) => p.id === id);
}

export async function getFeaturedPeople(limit = 6): Promise<Person[]> {
  // Farokh is pinned first among featured entrepreneurs on the homepage.
  return (await readPeople())
    .filter((p) => p.featured)
    .sort((a, b) => (a.slug === "farokh-shahabi" ? -1 : b.slug === "farokh-shahabi" ? 1 : 0))
    .slice(0, limit);
}

export async function getPeopleCount(): Promise<number> {
  return (await readPeople()).length;
}

export async function getPeopleCountries(): Promise<string[]> {
  return Array.from(new Set((await readPeople()).map((p) => p.country))).sort();
}

export async function getPeopleSegments(): Promise<Segment[]> {
  return Array.from(new Set((await readPeople()).map((p) => p.segment)));
}

export async function getPeopleIndustries(): Promise<string[]> {
  const people = await readPeople();
  const industries = await Promise.all(people.map((p) => personIndustries(p)));
  return Array.from(new Set(industries.flat())).sort();
}

export async function addPerson(person: Person): Promise<void> {
  const people = await readPeople();
  people.push(person);
  await writePeople(people, `Add person: ${person.name}`);
}

export async function updatePerson(id: string, patch: Partial<Person>): Promise<void> {
  const people = await readPeople();
  const index = people.findIndex((p) => p.id === id);
  if (index === -1) return;
  people[index] = { ...people[index], ...patch };
  await writePeople(people, `Edit person: ${people[index].name}`);
}
