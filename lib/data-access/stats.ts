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

/** Computed live from People + Startups data — never hand-maintained. */
export async function getSiteStats(): Promise<SiteStats> {
  const [peopleCountries, startupCountries, totalEntrepreneurs, totalStartups, totalValuationMillions] =
    await Promise.all([
      getPeopleCountries(),
      getStartupCountries(),
      getPeopleCount(),
      getStartupsCount(),
      getTotalTrackedValuationMillions(),
    ]);
  const countries = new Set([...peopleCountries, ...startupCountries]);

  return {
    totalEntrepreneurs,
    totalStartups,
    countriesRepresented: countries.size,
    combinedTrackedValuation: formatMillionsAsValuation(totalValuationMillions),
  };
}
