import { hackathonCohorts } from "@/lib/data/hackathonCohorts";
import type { HackathonCohort } from "@/lib/types";

/** Cohorts whose recap page is temporarily hidden — link elsewhere instead of to their /hackathon/cohorts/[slug] page. */
const HIDDEN_RECAP_SLUGS = ["winter-2026"];

export function isRecapHidden(slug: string): boolean {
  return HIDDEN_RECAP_SLUGS.includes(slug);
}

export function getCohortRecapHref(cohort: HackathonCohort): string {
  return isRecapHidden(cohort.slug) ? "/hackathon/cohorts" : `/hackathon/cohorts/${cohort.slug}`;
}

/** The cohort to feature on Home/Hackathon landing — prefers an open or upcoming cohort over closed ones. */
export function getCurrentCohort(): HackathonCohort | undefined {
  return (
    hackathonCohorts.find((c) => c.status === "applications-open") ??
    hackathonCohorts.find((c) => c.status === "upcoming") ??
    hackathonCohorts[0]
  );
}

export function getPastCohorts(): HackathonCohort[] {
  return hackathonCohorts.filter((c) => c.status === "closed");
}

export function getCohortBySlug(slug: string): HackathonCohort | undefined {
  return hackathonCohorts.find((c) => c.slug === slug);
}

/** Newest first — used by the cohort archive. */
export function getAllCohorts(): HackathonCohort[] {
  return [...hackathonCohorts].sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1));
}

export type CohortDisplayState =
  | { state: "upcoming"; daysUntilOpen: number }
  | { state: "applications-open"; daysUntilClose: number }
  | { state: "closed" };

/** Derives the banner state live from the cohort's dates rather than trusting a hand-set status field. */
export function getCohortDisplayState(cohort: HackathonCohort, now = new Date()): CohortDisplayState {
  const opensAt = new Date(cohort.applicationsOpenAt);
  const closesAt = new Date(cohort.applicationsCloseAt);
  const msPerDay = 1000 * 60 * 60 * 24;

  if (now < opensAt) {
    return { state: "upcoming", daysUntilOpen: Math.ceil((opensAt.getTime() - now.getTime()) / msPerDay) };
  }
  if (now <= closesAt) {
    return { state: "applications-open", daysUntilClose: Math.ceil((closesAt.getTime() - now.getTime()) / msPerDay) };
  }
  return { state: "closed" };
}
