import { readCollection, writeCollection } from "@/lib/server/collection-store";
import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";
import type { Person } from "@/lib/types";

// GitHub-backed "database" — data/people.json is the source of truth, fetched via the GitHub API (see lib/server/github-store.ts).
// Profiles the Divan AI added from news live in a separate collection (data/people-auto.json) so the daily job never rewrites
// the hand-curated file; they are merged in here so every page and admin tool sees one list.
const AUTO_FILE = "data/people-auto.json";

export async function readPeople(): Promise<Person[]> {
  const [main, auto] = await Promise.all([readJsonFile<Person[]>("data/people.json"), readCollection<Person>(AUTO_FILE)]);
  return [...main, ...auto];
}

export async function writePeople(people: Person[], message = "Update data/people.json"): Promise<void> {
  const main = people.filter((p) => !p.auto);
  const auto = people.filter((p) => p.auto);
  const before = await readCollection<Person>(AUTO_FILE);
  if (JSON.stringify(before) !== JSON.stringify(auto)) await writeCollection(AUTO_FILE, auto, message);
  return writeJsonFile("data/people.json", main, message);
}

export function readAutoPeople(): Promise<Person[]> {
  return readCollection<Person>(AUTO_FILE);
}

export function writeAutoPeople(people: Person[], message: string): Promise<void> {
  return writeCollection(AUTO_FILE, people, message);
}
