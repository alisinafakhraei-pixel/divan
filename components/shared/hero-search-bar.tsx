"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value)}`);
      }}
      className="flex w-full max-w-lg flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search entrepreneurs, startups, news..."
          className="h-11 pl-9"
        />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Search
      </Button>
    </form>
  );
}
