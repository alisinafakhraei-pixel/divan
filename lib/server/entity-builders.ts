import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import type { Person, Startup, ValuationTier } from "@/lib/types";

function splitList(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function deriveValuationTier(valuation?: string): ValuationTier {
  const numeric = parseFloat((valuation ?? "").replace(/[^0-9.]/g, "")) || 0;
  const millions = /b/i.test(valuation ?? "") ? numeric * 1000 : numeric;
  if (millions >= 10000) return "+$10B";
  if (millions >= 1000) return "+$1B";
  if (millions >= 100) return "$100M-$1B";
  if (millions >= 10) return "$10M-$100M";
  return "Under $10M";
}

/** Maps contribute-form field values onto Person fields — the inverse of personToFieldValues. */
export function toPersonPatch(payload: Record<string, string>): Partial<Person> {
  const knownForStartup = getStartups().find(
    (s) => s.name.toLowerCase() === (payload.knownFor ?? "").toLowerCase()
  );

  return {
    name: payload.name,
    title: payload.title,
    knownFor: payload.knownFor,
    knownForStartupId: knownForStartup?.id,
    segment: payload.segment as Person["segment"],
    country: payload.country,
    bio: payload.bio,
    previousCompanies: splitList(payload.previousCompanies),
    valuation: payload.valuation || undefined,
    additionalInfo: payload.linkedin ? [{ label: "LinkedIn", url: payload.linkedin }] : [],
  };
}

/** Maps contribute-form field values onto Startup fields — the inverse of startupToFieldValues.
 *  `valuationTier` and `companyType` aren't collected by the form, so they're derived/defaulted here. */
export function toStartupPatch(payload: Record<string, string>): Partial<Startup> {
  const founderIds = splitList(payload.founders)
    .map((name) => getPeople().find((p) => p.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => Boolean(id));

  return {
    name: payload.name,
    tagline: payload.tagline,
    website: payload.website,
    fundingRound: payload.fundingRound as Startup["fundingRound"],
    valuation: payload.valuation || undefined,
    valuationTier: deriveValuationTier(payload.valuation),
    businessModel: payload.businessModel as Startup["businessModel"],
    operatingStatus: payload.operatingStatus as Startup["operatingStatus"],
    hqCountry: payload.hqCountry,
    hqRegion: payload.hqRegion,
    industries: splitList(payload.industries),
    mainCategory: payload.mainCategory,
    teamSize: payload.teamSize ? Number(payload.teamSize) : 0,
    foundedYear: payload.foundedYear ? Number(payload.foundedYear) : new Date().getFullYear(),
    notes: payload.notes,
    founderIds,
  };
}
