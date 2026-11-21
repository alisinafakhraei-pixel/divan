import { news as curatedNews } from "@/lib/data/news";
import { readAutoNews } from "@/lib/server/news-store";
import type { NewsItem, NewsType } from "@/lib/types";

export interface NewsFilters {
  type?: NewsType;
  search?: string;
}

/** Hand-submitted items plus whatever the Divan AI curator has found and verified. */
async function allNews(): Promise<NewsItem[]> {
  const auto = await readAutoNews();
  return [...auto, ...curatedNews];
}

export async function getNews(filters?: NewsFilters): Promise<NewsItem[]> {
  let result = (await allNews()).sort((a, b) => (a.date < b.date ? 1 : -1));

  if (filters?.type) result = result.filter((n) => n.type === filters.type);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.tldr.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return (await allNews()).find((n) => n.slug === slug);
}

export async function getLatestNews(limit = 5): Promise<NewsItem[]> {
  return (await getNews()).slice(0, limit);
}

export async function getRelatedNews(entityId: string, limit = 3): Promise<NewsItem[]> {
  return (await getNews())
    .filter((n) => n.relatedEntityIds.includes(entityId))
    .slice(0, limit);
}

export async function getNewsTypes(): Promise<NewsType[]> {
  return Array.from(new Set((await allNews()).map((n) => n.type)));
}
