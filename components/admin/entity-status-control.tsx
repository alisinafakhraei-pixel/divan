"use client";

import { adminSetEntityStatus } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EntityStatus } from "@/lib/types";
import { useState } from "react";

const STATUS_META: Record<EntityStatus, { label: string; badgeVariant: "success" | "warning" | "destructive" }> = {
  public: { label: "Public", badgeVariant: "success" },
  pending: { label: "Pending", badgeVariant: "warning" },
  rejected: { label: "Rejected", badgeVariant: "destructive" },
};

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.badgeVariant}>{meta.label}</Badge>;
}

interface EntityStatusControlProps {
  kind: "person" | "startup";
  targetId: string;
  status: EntityStatus;
}

export function EntityStatusControl({ kind, targetId, status }: EntityStatusControlProps) {
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState<EntityStatus | null>(null);

  async function setStatus(next: EntityStatus) {
    if (next === current) return;
    setPending(next);
    await adminSetEntityStatus(kind, targetId, next);
    setCurrent(next);
    setPending(null);
  }

  return (
    <div className="flex items-center gap-2">
      <EntityStatusBadge status={current} />
      <div className="flex gap-1">
        {(Object.keys(STATUS_META) as EntityStatus[]).map((option) => (
          <Button
            key={option}
            type="button"
            variant={option === current ? "default" : "outline"}
            size="sm"
            disabled={pending !== null}
            onClick={() => setStatus(option)}
            className={cn(option === current && "pointer-events-none")}
          >
            {pending === option ? "Saving..." : STATUS_META[option].label}
          </Button>
        ))}
      </div>
    </div>
  );
}
