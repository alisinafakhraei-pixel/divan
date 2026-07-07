import { readStartups, writeStartups } from "@/lib/data/startups";
import type {
  BusinessModel,
  CompanyType,
  FundingRound,
  OperatingStatus,
  Startup,
  ValuationTier,
} from "@/lib/types";
import { parseValuationToMillions } from "@/lib/utils";

export interface StartupFilters {
  valuationTier?: ValuationTier;
  fundingRound?: FundingRound;
  industry?: string;
  mainCategory?: string;
  businessModel?: BusinessModel;
  hqCountry?: string;
  operatingStatus?: OperatingStatus;
  companyType?: CompanyType;
  search?: string;
}

export type StartupSort = "valuation-desc" | "newest" | "name-asc";

export async function getStartups(
  filters?: StartupFilters,
  sort: StartupSort = "valuation-desc"
): Promise<Startup[]> {
  let result = await readStartups();

  if (filters?.valuationTier) result = result.filter((s) => s.valuationTier === filters.valuationTier);
  if (filters?.fundingRound) result = result.filter((s) => s.fundingRound === filters.fundingRound);
  if (filters?.industry) result = result.filter((s) => s.industries.includes(filters.industry!));
  if (filters?.mainCategory) result = result.filter((s) => s.mainCategory === filters.mainCategory);
  if (filters?.businessModel) result = result.filter((s) => s.businessModel === filters.businessModel);
  if (filters?.hqCountry) result = result.filter((s) => s.hqCountry === filters.hqCountry);
  if (filters?.operatingStatus) result = result.filter((s) => s.operatingStatus === filters.operatingStatus);
  if (filters?.companyType) result = result.filter((s) => s.companyType === filters.companyType);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q)
    );
  }

  if (sort === "valuation-desc") {
    result.sort((a, b) => parseValuationToMillions(b.valuation) - parseValuationToMillions(a.valuation));
  }
  if (sort === "newest") result.sort((a, b) => b.foundedYear - a.foundedYear);
  if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

export async function getStartupBySlug(slug: string): Promise<Startup | undefined> {
  return (await readStartups()).find((s) => s.slug === slug);
}

export async function getStartupById(id: string): Promise<Startup | undefined> {
  return (await readStartups()).find((s) => s.id === id);
}

export async function getFeaturedStartups(limit = 6): Promise<Startup[]> {
  return (await getStartups(undefined, "valuation-desc")).slice(0, limit);
}

export async function getStartupsCount(): Promise<number> {
  return (await readStartups()).length;
}

export async function getTotalTrackedValuationMillions(): Promise<number> {
  return (await readStartups()).reduce((sum, s) => sum + parseValuationToMillions(s.valuation), 0);
}

export async function getStartupCountries(): Promise<string[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.hqCountry))).sort();
}

export async function getStartupIndustries(): Promise<string[]> {
  return Array.from(new Set((await readStartups()).flatMap((s) => s.industries))).sort();
}

export async function getStartupValuationTiers(): Promise<ValuationTier[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.valuationTier)));
}

export async function getStartupFundingRounds(): Promise<FundingRound[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.fundingRound)));
}

export async function getStartupBusinessModels(): Promise<BusinessModel[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.businessModel)));
}

export async function getStartupOperatingStatuses(): Promise<OperatingStatus[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.operatingStatus)));
}

export async function getStartupCompanyTypes(): Promise<CompanyType[]> {
  return Array.from(new Set((await readStartups()).map((s) => s.companyType)));
}

export async function addStartup(startup: Startup): Promise<void> {
  const startups = await readStartups();
  startups.push(startup);
  await writeStartups(startups, `Add startup: ${startup.name}`);
}

export async function updateStartup(id: string, patch: Partial<Startup>): Promise<void> {
  const startups = await readStartups();
  const index = startups.findIndex((s) => s.id === id);
  if (index === -1) return;
  startups[index] = { ...startups[index], ...patch };
  await writeStartups(startups, `Edit startup: ${startups[index].name}`);
}
