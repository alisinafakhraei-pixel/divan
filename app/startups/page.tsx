import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { StartupCard } from "@/components/shared/startup-card";
import { StartupTableRow } from "@/components/shared/startup-table-row";
import { StartupsToolbar } from "@/components/startups/startups-toolbar";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import {
  getStartupBusinessModels,
  getStartupCompanyTypes,
  getStartupCountries,
  getStartupFundingRounds,
  getStartupIndustries,
  getStartupOperatingStatuses,
  getStartups,
  getStartupValuationTiers,
  type StartupSort,
} from "@/lib/data-access/startups";
import type { BusinessModel, CompanyType, FundingRound, OperatingStatus, ValuationTier } from "@/lib/types";
import Link from "next/link";

const PAGE_SIZE = 9;

export default async function StartupsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const view = params.view === "table" ? "table" : "grid";

  const [
    results,
    valuationTiers,
    fundingRounds,
    industries,
    businessModels,
    countries,
    operatingStatuses,
    companyTypes,
  ] = await Promise.all([
    getStartups(
      {
        search: params.q,
        valuationTier: params.valuationTier as ValuationTier | undefined,
        fundingRound: params.fundingRound as FundingRound | undefined,
        industry: params.industry,
        businessModel: params.businessModel as BusinessModel | undefined,
        hqCountry: params.hqCountry,
        operatingStatus: params.operatingStatus as OperatingStatus | undefined,
        companyType: params.companyType as CompanyType | undefined,
      },
      (params.sort as StartupSort) ?? "valuation-desc"
    ),
    getStartupValuationTiers(),
    getStartupFundingRounds(),
    getStartupIndustries(),
    getStartupBusinessModels(),
    getStartupCountries(),
    getStartupOperatingStatuses(),
    getStartupCompanyTypes(),
  ]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading
          as="h1"
          bold="All"
          muted="startups"
          subhead="Startups and big companies founded or led by Iranian entrepreneurs worldwide."
        />
        <Button variant="outline" render={<Link href="/contribute?tab=startup" />} className="shrink-0">
          Suggest a startup
        </Button>
      </div>

      <StartupsToolbar
        valuationTiers={valuationTiers}
        fundingRounds={fundingRounds}
        industries={industries}
        businessModels={businessModels}
        countries={countries}
        operatingStatuses={operatingStatuses}
        companyTypes={companyTypes}
      />

      {pageItems.length === 0 ? (
        <EmptyState title="No startups found" description="Try adjusting your filters or search terms." />
      ) : view === "table" ? (
        <div className="rounded-xl border border-border">
          {pageItems.map((startup) => (
            <StartupTableRow key={startup.id} startup={startup} />
          ))}
        </div>
      ) : (
        <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {pageItems.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      )}

      <UrlPagination pageCount={pageCount} />
    </div>
  );
}
