import { readJson, writeJson } from "@/lib/server/json-store";
import type { Submission } from "@/lib/types";

// GitHub-backed "database" — data/submissions.json is the source of truth, read fresh on every call, no in-memory caching.
export function readSubmissions(): Submission[] {
  return readJson<Submission[]>("submissions.json");
}

export function writeSubmissions(submissions: Submission[]): void {
  writeJson("submissions.json", submissions);
}
