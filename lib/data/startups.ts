import { readCollection, writeCollection } from "@/lib/server/collection-store";
import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";
import type { Startup } from "@/lib/types";

// GitHub-backed "database" — data/startups.json is the source of truth, fetched via the GitHub API (see lib/server/github-store.ts).
// Companies the Divan AI added from news live in data/startups-auto.json and are merged in here (see lib/data/people.ts).
const AUTO_FILE = "data/startups-auto.json";

export async function readStartups(): Promise<Startup[]> {
  const [main, auto] = await Promise.all([readJsonFile<Startup[]>("data/startups.json"), readCollection<Startup>(AUTO_FILE)]);
  return [...main, ...auto];
}

export async function writeStartups(startups: Startup[], message = "Update data/startups.json"): Promise<void> {
  const main = startups.filter((s) => !s.auto);
  const auto = startups.filter((s) => s.auto);
  const before = await readCollection<Startup>(AUTO_FILE);
  if (JSON.stringify(before) !== JSON.stringify(auto)) await writeCollection(AUTO_FILE, auto, message);
  return writeJsonFile("data/startups.json", main, message);
}

export function readAutoStartups(): Promise<Startup[]> {
  return readCollection<Startup>(AUTO_FILE);
}

export function writeAutoStartups(startups: Startup[], message: string): Promise<void> {
  return writeCollection(AUTO_FILE, startups, message);
}
