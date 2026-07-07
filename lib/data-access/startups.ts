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

export function getStartups(
  filters?: StartupFilters,
  sort: StartupSort = "valuation-desc"
): Startup[] {
  let result = readStartups();

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

export function getStartupBySlug(slug: string): Startup | undefined {
  return readStartups().find((s) => s.slug === slug);
}

export function getStartupById(id: string): Startup | undefined {
  return readStartups().find((s) => s.id === id);
}

export function getFeaturedStartups(limit = 6): Startup[] {
  return getStartups(undefined, "valuation-desc").slice(0, limit);
}

export function getStartupsCount(): number {
  return readStartups().length;
}

export function getTotalTrackedValuationMillions(): number {
  return readStartups().reduce((sum, s) => sum + parseValuationToMillions(s.valuation), 0);
}

export function getStartupCountries(): string[] {
  return Array.from(new Set(readStartups().map((s) => s.hqCountry))).sort();
}

export function getStartupIndustries(): string[] {
  return Array.from(new Set(readStartups().flatMap((s) => s.industries))).sort();
}

export function getStartupValuationTiers(): ValuationTier[] {
  return Array.from(new Set(readStartups().map((s) => s.valuationTier)));
}

export function getStartupFundingRounds(): FundingRound[] {
  return Array.from(new Set(readStartups().map((s) => s.fundingRound)));
}

export function getStartupBusinessModels(): BusinessModel[] {
  return Array.from(new Set(readStartups().map((s) => s.businessModel)));
}

export function getStartupOperatingStatuses(): OperatingStatus[] {
  return Array.from(new Set(readStartups().map((s) => s.operatingStatus)));
}

export function getStartupCompanyTypes(): CompanyType[] {
  return Array.from(new Set(readStartups().map((s) => s.companyType)));
}

export function addStartup(startup: Startup): void {
  const startups = readStartups();
  startups.push(startup);
  writeStartups(startups);
}

export function updateStartup(id: string, patch: Partial<Startup>): void {
  const startups = readStartups();
  const index = startups.findIndex((s) => s.id === id);
  if (index === -1) return;
  startups[index] = { ...startups[index], ...patch };
  writeStartups(startups);
}
