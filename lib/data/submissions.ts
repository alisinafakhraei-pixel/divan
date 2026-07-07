import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";
import type { Submission } from "@/lib/types";

// GitHub-backed "database" — data/submissions.json is the source of truth, fetched via the GitHub API (see lib/server/github-store.ts).
export async function readSubmissions(): Promise<Submission[]> {
  return readJsonFile<Submission[]>("data/submissions.json");
}

export async function writeSubmissions(submissions: Submission[], message = "Update data/submissions.json"): Promise<void> {
  return writeJsonFile("data/submissions.json", submissions, message);
}
