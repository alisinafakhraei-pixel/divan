"use client";

import { FacetSelect, type FacetOption } from "@/components/shared/facet-select";
import { FilterToolbar } from "@/components/shared/filter-toolbar";
import { GridTableToggle, type ViewMode } from "@/components/shared/grid-table-toggle";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { Segment } from "@/lib/types";

interface EntrepreneursToolbarProps {
  countries: string[];
  segments: Segment[];
  industries: string[];
}

const SORT_OPTIONS: FacetOption[] = [
  { value: "name-asc", label: "A–Z" },
  { value: "recent", label: "Most recently added" },
  { value: "most-viewed", label: "Most viewed" },
];

export function EntrepreneursToolbar({ countries, segments, industries }: EntrepreneursToolbarProps) {
  const { getParam, setParam } = useUrlFilters();

  const view = (getParam("view") as ViewMode) ?? "grid";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <FilterToolbar
        searchPlaceholder="Search by name or company..."
        searchValue={getParam("q") ?? ""}
        onSearchChange={(value) => setParam("q", value || undefined)}
      >
        <FacetSelect
          value={getParam("country") ?? "all"}
          onValueChange={(v) => setParam("country", v)}
          allLabel="All countries"
          options={countries.map((c) => ({ value: c, label: c }))}
        />

        <FacetSelect
          value={getParam("segment") ?? "all"}
          onValueChange={(v) => setParam("segment", v)}
          allLabel="All segments"
          options={segments.map((s) => ({ value: s, label: s }))}
        />

        <FacetSelect
          value={getParam("industry") ?? "all"}
          onValueChange={(v) => setParam("industry", v)}
          allLabel="All industries"
          options={industries.map((i) => ({ value: i, label: i }))}
        />

        <FacetSelect
          value={getParam("sort") ?? "name-asc"}
          onValueChange={(v) => setParam("sort", v, { resetPage: false })}
          allLabel="Sort"
          options={SORT_OPTIONS}
        />
      </FilterToolbar>

      <GridTableToggle value={view} onChange={(v) => setParam("view", v, { resetPage: false })} />
    </div>
  );
}
