"use client";

import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface PickerPerson {
  name: string;
  slug: string;
  title: string;
  knownFor: string;
  picture: string;
}

/** "Who do you want to vouch for?" — finds a person and opens their profile with the vouch form already open. */
export function VouchPersonPicker({ people }: { people: PickerPerson[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q
    ? people.filter((p) => p.name.toLowerCase().includes(q) || p.knownFor.toLowerCase().includes(q)).slice(0, 5)
    : [];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for the person you want to vouch for..."
          className="h-11 pl-9"
          aria-label="Search for a person to vouch for"
        />
      </div>
      {q ? (
        matches.length > 0 ? (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {matches.map((person) => (
              <li key={person.slug}>
                <Link
                  href={`/entrepreneurs/${person.slug}?vouch=1`}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-muted"
                >
                  <EntityAvatar name={person.name} image={person.picture} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground">{person.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {person.title} · {person.knownFor}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-medium text-action-blue">Vouch</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No one by that name yet. Know them?{" "}
            <Link href="/contribute?tab=person" className="font-medium text-action-blue hover:underline">
              Suggest them for the directory
            </Link>
            .
          </p>
        )
      ) : null}
    </div>
  );
}
