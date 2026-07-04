import { people } from "@/lib/data/people";
import { startups } from "@/lib/data/startups";

export interface BreakdownItem {
  label: string;
  value: number;
}

/** Aliases from our fixture country names to the world-atlas topojson's country names. */
export const COUNTRY_TOPOJSON_ALIASES: Record<string, string> = {
  "United States": "United States of America",
};

export type MapMode = "people" | "startups" | "both";

/** Country counts keyed by OUR fixture country names (map matching happens in the WorldMap component). */
export function getCountryCounts(mode: MapMode): BreakdownItem[] {
  const counts = new Map<string, number>();

  if (mode === "people" || mode === "both") {
    for (const p of people) counts.set(p.country, (counts.get(p.country) ?? 0) + 1);
  }
  if (mode === "startups" || mode === "both") {
    for (const s of startups) counts.set(s.hqCountry, (counts.get(s.hqCountry) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getHqLocationBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of startups) counts.set(s.hqCountry, (counts.get(s.hqCountry) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getBusinessModelBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of startups) counts.set(s.businessModel, (counts.get(s.businessModel) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export function getIndustryBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of startups) {
    for (const industry of s.industries) counts.set(industry, (counts.get(industry) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getFundingStageBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of startups) counts.set(s.fundingRound, (counts.get(s.fundingRound) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}
