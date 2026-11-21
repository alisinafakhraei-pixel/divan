import { readCollection, writeCollection } from "@/lib/server/collection-store";
import type { NewsItem } from "@/lib/types";

const FILE = "data/news-auto.json";
const MAX_ITEMS = 200;

export function readAutoNews(): Promise<NewsItem[]> {
  return readCollection<NewsItem>(FILE);
}

export async function writeAutoNews(items: NewsItem[]): Promise<void> {
  const trimmed = [...items].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, MAX_ITEMS);
  await writeCollection(FILE, trimmed, "Auto-curated news update");
}
