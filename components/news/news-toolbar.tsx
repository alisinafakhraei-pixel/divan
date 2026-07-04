"use client";

import { FacetSelect } from "@/components/shared/facet-select";
import { FilterToolbar } from "@/components/shared/filter-toolbar";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { NewsType } from "@/lib/types";

export function NewsToolbar({ types }: { types: NewsType[] }) {
  const { getParam, setParam } = useUrlFilters();

  return (
    <FilterToolbar
      searchPlaceholder="Search news..."
      searchValue={getParam("q") ?? ""}
      onSearchChange={(value) => setParam("q", value || undefined)}
    >
      <FacetSelect
        value={getParam("type") ?? "all"}
        onValueChange={(v) => setParam("type", v)}
        allLabel="All types"
        options={types.map((t) => ({ value: t, label: t }))}
      />
    </FilterToolbar>
  );
}
