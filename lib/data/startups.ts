import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";
import type { Startup } from "@/lib/types";

// GitHub-backed "database" — data/startups.json is the source of truth, fetched via the GitHub API (see lib/server/github-store.ts).
export async function readStartups(): Promise<Startup[]> {
  return readJsonFile<Startup[]>("data/startups.json");
}

export async function writeStartups(startups: Startup[], message = "Update data/startups.json"): Promise<void> {
  return writeJsonFile("data/startups.json", startups, message);
}
