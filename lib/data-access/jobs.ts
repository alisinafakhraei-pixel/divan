import { jobs } from "@/lib/data/jobs";
import type { Job } from "@/lib/types";

export interface JobFilters {
  location?: string;
  type?: Job["type"];
  category?: string;
  search?: string;
}

export function getJobs(filters?: JobFilters): Job[] {
  let result = [...jobs].sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));

  if (filters?.location) result = result.filter((j) => j.location.includes(filters.location!));
  if (filters?.type) result = result.filter((j) => j.type === filters.type);
  if (filters?.category) result = result.filter((j) => j.category === filters.category);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (j) => j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q)
    );
  }

  return result;
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
