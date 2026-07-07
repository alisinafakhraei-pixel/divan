import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";
import type { Person } from "@/lib/types";

// GitHub-backed "database" — data/people.json is the source of truth, fetched via the GitHub API (see lib/server/github-store.ts).
export async function readPeople(): Promise<Person[]> {
  return readJsonFile<Person[]>("data/people.json");
}

export async function writePeople(people: Person[], message = "Update data/people.json"): Promise<void> {
  return writeJsonFile("data/people.json", people, message);
}
