import { getPeopleCount, getPeopleCountries } from "@/lib/data-access/people";
import {
  getStartupCountries,
  getStartupsCount,
  getTotalTrackedValuationMillions,
} from "@/lib/data-access/startups";
import { formatMillionsAsValuation } from "@/lib/utils";

export interface SiteStats {
  totalEntrepreneurs: number;
  totalStartups: number;
  countriesRepresented: number;
  combinedTrackedValuation: string;
}

/** Computed live from People + Startups fixtures — never hand-maintained. */
export function getSiteStats(): SiteStats {
  const countries = new Set([...getPeopleCountries(), ...getStartupCountries()]);
  return {
    totalEntrepreneurs: getPeopleCount(),
    totalStartups: getStartupsCount(),
    countriesRepresented: countries.size,
    combinedTrackedValuation: formatMillionsAsValuation(getTotalTrackedValuationMillions()),
  };
}
