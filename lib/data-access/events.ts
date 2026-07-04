import { events } from "@/lib/data/events";
import type { DivanEvent } from "@/lib/types";

export function getUpcomingEvents(limit?: number): DivanEvent[] {
  const upcoming = events
    .filter((e) => !e.isPast)
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getPastEvents(limit?: number): DivanEvent[] {
  const past = events
    .filter((e) => e.isPast)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return limit ? past.slice(0, limit) : past;
}

export function getEventBySlug(slug: string): DivanEvent | undefined {
  return events.find((e) => e.slug === slug);
}
