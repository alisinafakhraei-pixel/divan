"use client";

import { Button } from "@/components/ui/button";
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
 *  Search only fires on submit (Enter or the Search button), not on every keystroke — same UX as the homepage search bar. */
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
        className="flex w-full gap-2 sm:max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchChange?.(value);
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
