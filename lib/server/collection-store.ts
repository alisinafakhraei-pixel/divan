import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJsonFile, writeJsonFile } from "@/lib/server/github-store";

// A JSON-array collection in data/. In production it lives in the GitHub-backed data layer (the deployed
// filesystem is read-only); everywhere else it is the local working-tree file, so developing or testing on
// localhost can never write to the live repo.
const useGitHub = process.env.NODE_ENV === "production";

export async function readCollection<T>(file: string): Promise<T[]> {
  try {
    if (useGitHub) return await readJsonFile<T[]>(file);
    return JSON.parse(await readFile(path.join(process.cwd(), file), "utf-8")) as T[];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(file: string, items: T[], commitMessage: string): Promise<void> {
  if (useGitHub) {
    await writeJsonFile(file, items, commitMessage);
    return;
  }
  await writeFile(path.join(process.cwd(), file), JSON.stringify(items, null, 2) + "\n");
}
