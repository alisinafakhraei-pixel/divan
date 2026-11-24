import { cn } from "@/lib/utils";
import type { ActivityItem, ActivityKind } from "@/lib/data-access/activity";
import { Building2, Newspaper, ShieldCheck, UserPlus, type LucideIcon } from "lucide-react";

export { Thumb } from "@/components/shared/thumb";

export const KIND_META: Record<ActivityKind, { label: string; plural: string; icon: LucideIcon; tint: string; chip: string }> = {
  person: { label: "New entrepreneur", plural: "Entrepreneurs", icon: UserPlus, tint: "bg-accent text-accent-foreground", chip: "bg-accent text-accent-foreground" },
  startup: { label: "New startup", plural: "Startups", icon: Building2, tint: "bg-success text-success-foreground", chip: "bg-success text-success-foreground" },
  news: { label: "News", plural: "News", icon: Newspaper, tint: "bg-secondary text-secondary-foreground", chip: "bg-secondary text-secondary-foreground" },
  vouch: { label: "New vouch", plural: "Vouches", icon: ShieldCheck, tint: "bg-warning text-warning-foreground", chip: "bg-warning text-warning-foreground" },
};

export const EXPLAINER =
  "Divan updates itself every day. Our AI reads the news for Iranian founders around the world, checks that every source is real, and adds the people, companies and stories it finds. Every item links back to where it came from.";

export function shortDate(date: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function whenLabel(item: ActivityItem): string {
  if (item.daysAgo === 0) return "Today";
  if (item.daysAgo === 1) return "Yesterday";
  return shortDate(item.date);
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function KindBadge({ kind, className }: { kind: ActivityKind; className?: string }) {
  const meta = KIND_META[kind];
  return (
    <span className={cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap [&>svg]:size-3", meta.chip, className)}>
      <meta.icon />
      {meta.label}
    </span>
  );
}

export function LiveDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-success-foreground opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-success-foreground" />
    </span>
  );
}
