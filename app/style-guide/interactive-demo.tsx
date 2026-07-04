"use client";

import { FilterToolbar } from "@/components/shared/filter-toolbar";
import { GridTableToggle, type ViewMode } from "@/components/shared/grid-table-toggle";
import { Pagination } from "@/components/shared/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function InteractiveDemo() {
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterToolbar
          searchPlaceholder="Search entrepreneurs..."
          searchValue={search}
          onSearchChange={setSearch}
        >
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ae">United Arab Emirates</SelectItem>
            </SelectContent>
          </Select>
        </FilterToolbar>
        <GridTableToggle value={view} onChange={setView} />
      </div>
      <p className="text-sm text-muted-foreground">
        Current view: <span className="font-medium text-foreground">{view}</span>
        {search ? (
          <>
            {" "}
            · search: <span className="font-medium text-foreground">{search}</span>
          </>
        ) : null}
      </p>
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
    </div>
  );
}
