import { readJson, writeJson } from "@/lib/server/json-store";
import type { Person } from "@/lib/types";

// GitHub-backed "database" — data/people.json is the source of truth, read fresh on every call, no in-memory caching.
export function readPeople(): Person[] {
  return readJson<Person[]>("people.json");
}

export function writePeople(people: Person[]): void {
  writeJson("people.json", people);
}
