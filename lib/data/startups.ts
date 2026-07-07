import { readJson, writeJson } from "@/lib/server/json-store";
import type { Startup } from "@/lib/types";

// GitHub-backed "database" — data/startups.json is the source of truth, read fresh on every call, no in-memory caching.
export function readStartups(): Startup[] {
  return readJson<Startup[]>("startups.json");
}

export function writeStartups(startups: Startup[]): void {
  writeJson("startups.json", startups);
}
