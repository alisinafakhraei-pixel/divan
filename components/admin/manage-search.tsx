"use client";

import { EntityStatusBadge } from "@/components/admin/entity-status-control";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { EntityStatus } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface ManageEntity {
  id: string;
  name: string;
  subtitle: string;
  kind: "person" | "startup";
  status: EntityStatus;
}

export function ManageSearch({ entities }: { entities: ManageEntity[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entities;
    return entities.filter((entity) => entity.name.toLowerCase().includes(q));
  }, [query, entities]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches.</p>
        ) : (
          filtered.map((entity) => (
            <Link
              key={`${entity.kind}-${entity.id}`}
              href={`/admin/manage/${entity.kind}/${entity.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-3 transition-colors hover:border-foreground"
            >
              <div>
                <p className="font-medium text-foreground">{entity.name}</p>
                <p className="text-xs text-muted-foreground">{entity.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <EntityStatusBadge status={entity.status} />
                <Badge variant="secondary">{entity.kind === "person" ? "Person" : "Startup"}</Badge>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
