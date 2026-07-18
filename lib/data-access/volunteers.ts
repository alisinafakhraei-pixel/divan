import { volunteers } from "@/lib/data/volunteers";
import type { Volunteer } from "@/lib/types";

export function getVolunteers(): Volunteer[] {
  return volunteers;
}

export function getVolunteerBySlug(slug: string): Volunteer | undefined {
  return volunteers.find((v) => v.slug === slug);
}
