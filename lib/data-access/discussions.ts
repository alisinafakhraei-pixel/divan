import { posts } from "@/lib/data/discussions";
import type { Post, PostType } from "@/lib/types";

export interface PostFilters {
  category?: string;
  search?: string;
}

export function getPosts(postType: PostType, filters?: PostFilters): Post[] {
  let result = posts.filter((p) => p.postType === postType);

  if (filters?.category) result = result.filter((p) => p.category === filters.category);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}
