"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Reads/writes directory filter state (search, facets, sort, view, page) via URL search params
 * so filtered views are shareable/linkable. This exact contract is reused by every directory
 * page (Entrepreneurs, Startups, ...) and referenced by Insights' click-to-filter.
 */
export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback((key: string) => searchParams.get(key) ?? undefined, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | undefined>, opts?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "all") params.set(key, value);
        else params.delete(key);
      }
      if (opts?.resetPage !== false) params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | undefined, opts?: { resetPage?: boolean }) =>
      setParams({ [key]: value }, opts),
    [setParams]
  );

  return { getParam, setParam, setParams, searchParams };
}
