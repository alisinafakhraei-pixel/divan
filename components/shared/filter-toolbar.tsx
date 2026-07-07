"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface FilterToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
}

/** Generic, slot-based toolbar — each directory page passes its own filter Selects as children.
 *  Search only fires on submit (Enter or the search icon), not on every keystroke — same UX as the homepage search bar. */
export function FilterToolbar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  children,
  className,
}: FilterToolbarProps) {
  const [value, setValue] = useState(searchValue);

  // Stay in sync if the URL-driven value changes from elsewhere (e.g. clearing filters).
  useEffect(() => setValue(searchValue), [searchValue]);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap", className)}>
      <form
        className="relative w-full sm:max-w-xs"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchChange?.(value);
        }}
      >
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-9"
        />
      </form>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
