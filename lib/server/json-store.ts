import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");

/** Reads a /data/*.json file fresh off disk on every call — this repo's checked-in JSON is the database, so no in-memory caching. */
export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, file), "utf-8"));
}

export function writeJson(file: string, data: unknown): void {
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2) + "\n", "utf-8");
}
