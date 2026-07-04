"use client";

import { FacetSelect } from "@/components/shared/facet-select";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { Perk } from "@/lib/types";

export function PerksToolbar({ categories }: { categories: Perk["category"][] }) {
  const { getParam, setParam } = useUrlFilters();

  return (
    <FacetSelect
      value={getParam("category") ?? "all"}
      onValueChange={(v) => setParam("category", v)}
      allLabel="All categories"
      options={categories.map((c) => ({ value: c, label: c }))}
    />
  );
}
