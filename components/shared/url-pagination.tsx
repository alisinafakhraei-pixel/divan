"use client";

import { Pagination } from "@/components/shared/pagination";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

export function UrlPagination({ pageCount }: { pageCount: number }) {
  const { getParam, setParam } = useUrlFilters();
  const page = Number(getParam("page") ?? "1");

  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={(p) => setParam("page", String(p), { resetPage: false })}
    />
  );
}
