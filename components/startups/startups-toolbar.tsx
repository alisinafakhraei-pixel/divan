"use client";

import { FacetSelect, type FacetOption } from "@/components/shared/facet-select";
import { FilterToolbar } from "@/components/shared/filter-toolbar";
import { GridTableToggle, type ViewMode } from "@/components/shared/grid-table-toggle";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { BusinessModel, CompanyType, FundingRound, OperatingStatus, ValuationTier } from "@/lib/types";

interface StartupsToolbarProps {
  valuationTiers: ValuationTier[];
  fundingRounds: FundingRound[];
  industries: string[];
  businessModels: BusinessModel[];
  countries: string[];
  operatingStatuses: OperatingStatus[];
  companyTypes: CompanyType[];
}

const SORT_OPTIONS: FacetOption[] = [
  { value: "valuation-desc", label: "Valuation (high to low)" },
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "A–Z" },
];

export function StartupsToolbar({
  valuationTiers,
  fundingRounds,
  industries,
  businessModels,
  countries,
  operatingStatuses,
  companyTypes,
}: StartupsToolbarProps) {
  const { getParam, setParam } = useUrlFilters();

  const view = (getParam("view") as ViewMode) ?? "grid";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <FilterToolbar
        searchPlaceholder="Search by name or tagline..."
        searchValue={getParam("q") ?? ""}
        onSearchChange={(value) => setParam("q", value || undefined)}
      >
        <FacetSelect
          value={getParam("valuationTier") ?? "all"}
          onValueChange={(v) => setParam("valuationTier", v)}
          allLabel="All valuations"
          options={valuationTiers.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("fundingRound") ?? "all"}
          onValueChange={(v) => setParam("fundingRound", v)}
          allLabel="All funding rounds"
          options={fundingRounds.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("industry") ?? "all"}
          onValueChange={(v) => setParam("industry", v)}
          allLabel="All industries"
          options={industries.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("businessModel") ?? "all"}
          onValueChange={(v) => setParam("businessModel", v)}
          allLabel="All business models"
          options={businessModels.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("hqCountry") ?? "all"}
          onValueChange={(v) => setParam("hqCountry", v)}
          allLabel="All HQ countries"
          options={countries.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("operatingStatus") ?? "all"}
          onValueChange={(v) => setParam("operatingStatus", v)}
          allLabel="All statuses"
          options={operatingStatuses.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("companyType") ?? "all"}
          onValueChange={(v) => setParam("companyType", v)}
          allLabel="All company types"
          options={companyTypes.map((v) => ({ value: v, label: v }))}
        />

        <FacetSelect
          value={getParam("sort") ?? "valuation-desc"}
          onValueChange={(v) => setParam("sort", v, { resetPage: false })}
          allLabel="Sort"
          options={SORT_OPTIONS}
        />
      </FilterToolbar>

      <GridTableToggle value={view} onChange={(v) => setParam("view", v, { resetPage: false })} />
    </div>
  );
}
