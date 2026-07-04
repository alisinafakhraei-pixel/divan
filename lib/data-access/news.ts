import { news } from "@/lib/data/news";
import type { NewsItem, NewsType } from "@/lib/types";

export interface NewsFilters {
  type?: NewsType;
  search?: string;
}

export function getNews(filters?: NewsFilters): NewsItem[] {
  let result = [...news].sort((a, b) => (a.date < b.date ? 1 : -1));

  if (filters?.type) result = result.filter((n) => n.type === filters.type);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.tldr.toLowerCase().includes(q)
    );
  }

  return result;
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return news.find((n) => n.slug === slug);
}

export function getLatestNews(limit = 5): NewsItem[] {
  return getNews().slice(0, limit);
}

export function getRelatedNews(entityId: string, limit = 3): NewsItem[] {
  return getNews()
    .filter((n) => n.relatedEntityIds.includes(entityId))
    .slice(0, limit);
}

export function getNewsTypes(): NewsType[] {
  return Array.from(new Set(news.map((n) => n.type)));
}
