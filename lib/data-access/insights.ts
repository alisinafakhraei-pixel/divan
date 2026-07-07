import { readPeople } from "@/lib/data/people";
import { readStartups } from "@/lib/data/startups";

export { COUNTRY_TOPOJSON_ALIASES } from "@/lib/country-aliases";

export interface BreakdownItem {
  label: string;
  value: number;
}

export type MapMode = "people" | "startups" | "both";

/** Country counts keyed by OUR fixture country names (map matching happens in the WorldMap component). */
export function getCountryCounts(mode: MapMode): BreakdownItem[] {
  const counts = new Map<string, number>();

  if (mode === "people" || mode === "both") {
    for (const p of readPeople()) counts.set(p.country, (counts.get(p.country) ?? 0) + 1);
  }
  if (mode === "startups" || mode === "both") {
    for (const s of readStartups()) counts.set(s.hqCountry, (counts.get(s.hqCountry) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getHqLocationBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of readStartups()) counts.set(s.hqCountry, (counts.get(s.hqCountry) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getBusinessModelBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of readStartups()) counts.set(s.businessModel, (counts.get(s.businessModel) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export function getIndustryBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of readStartups()) {
    for (const industry of s.industries) counts.set(industry, (counts.get(industry) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getFundingStageBreakdown(): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const s of readStartups()) counts.set(s.fundingRound, (counts.get(s.fundingRound) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}
