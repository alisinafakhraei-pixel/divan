"use client";

import { EntityAvatar } from "@/components/shared/entity-avatar";
import { KIND_META, KindBadge, Thumb, whenLabel } from "@/components/home/whats-new/shared";
import type { ActivityItem, ActivityKind } from "@/lib/data-access/activity";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

type Range = "today" | "week" | "two";
const RANGES: { key: Range; label: string; match: (d: number) => boolean }[] = [
  { key: "today", label: "Today", match: (d) => d === 0 },
  { key: "week", label: "This week", match: (d) => d <= 6 },
  { key: "two", label: "Last 2 weeks", match: (d) => d <= 13 },
];
const TYPES: ("all" | ActivityKind)[] = ["all", "person", "startup", "news"];

function Card({ item }: { item: ActivityItem }) {
  const profile = item.kind === "person" || item.kind === "startup";
  return (
    <Link href={item.href} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-md">
      {item.kind === "news" ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Thumb src={item.image} className="transition-transform duration-500 group-hover:scale-105" />
        </div>
      ) : (
        <div className={cn("flex h-20 w-full items-start justify-between px-4 pt-3", item.kind === "person" ? "bg-gradient-to-br from-accent to-accent/20" : "bg-gradient-to-br from-success to-success/20")}>
          <KindBadge kind={item.kind} />
          {item.daysAgo <= 1 ? <span className="rounded-full bg-action-blue px-1.5 py-px text-[10px] font-bold tracking-wide text-white uppercase">New</span> : null}
        </div>
      )}
      <div className={cn("flex flex-1 flex-col gap-2 p-4", profile && "-mt-9")}>
        {profile ? <EntityAvatar name={item.title} image={item.image} square={item.kind === "startup"} className="size-14 ring-4 ring-background" /> : null}
        {!profile ? (
          <div className="flex items-center justify-between gap-2">
            <KindBadge kind="news" />
            <span className="text-xs text-muted-foreground">{whenLabel(item)}</span>
          </div>
        ) : null}
        <p className="font-semibold text-foreground">{item.title}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{profile ? item.subtitle : item.blurb}</p>
        {item.source ? <p className="mt-auto pt-1 text-xs text-muted-foreground">{profile ? `Found in ${item.source}` : item.source}</p> : null}
      </div>
    </Link>
  );
}

/** Tap a time range and a type to browse everything new, as cards. */
export function Explorer({ items }: { items: ActivityItem[] }) {
  const [range, setRange] = useState<Range>("two");
  const [type, setType] = useState<"all" | ActivityKind>("all");
  const inRange = items.filter((i) => RANGES.find((r) => r.key === range)!.match(i.daysAgo));
  const shown = (type === "all" ? inRange : inRange.filter((i) => i.kind === type)).slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-full bg-muted p-1" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button key={r.key} type="button" role="tab" aria-selected={range === r.key} onClick={() => setRange(r.key)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", range === r.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const count = t === "all" ? inRange.length : inRange.filter((i) => i.kind === t).length;
            return (
              <button key={t} type="button" onClick={() => setType(t)} className={cn("rounded-full border px-3 py-1 text-sm transition-colors", type === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground")}>
                {t === "all" ? "Everything" : KIND_META[t].plural} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nothing here yet. Try another day. New things are added daily.</p>
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((item) => (
            <Card key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
