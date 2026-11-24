import { EXPLAINER, KIND_META, LiveDot } from "@/components/home/whats-new/shared";
import type { ActivityFeed, ActivityKind } from "@/lib/data-access/activity";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TILES: { kind: ActivityKind; href: string }[] = [
  { kind: "person", href: "/entrepreneurs" },
  { kind: "startup", href: "/startups" },
  { kind: "news", href: "/news" },
  { kind: "vouch", href: "/vouch" },
];

/** The top of the section: what it is, in one paragraph, plus four live counters that link to the full lists. */
export function WhatsNewPanel({ summary }: { summary: ActivityFeed["summary"] }) {
  return (
    <div className="grid gap-6 overflow-hidden rounded-3xl bg-accent/50 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
          <LiveDot /> Updated daily, automatically
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          What&apos;s new <span className="font-normal text-muted-foreground">on Divan</span>
        </h2>
        <p className="max-w-xl text-muted-foreground">{EXPLAINER}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TILES.map(({ kind, href }) => {
          const meta = KIND_META[kind];
          return (
            <Link
              key={kind}
              href={href}
              className="rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={cn("flex size-8 items-center justify-center rounded-full", meta.tint)}>
                <meta.icon className="size-4" />
              </span>
              <span className="mt-3 block text-3xl font-extrabold tracking-tight text-foreground">{summary[kind]}</span>
              <span className="block text-sm text-muted-foreground">
                new {meta.plural.toLowerCase()} <span className="whitespace-nowrap">this week</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
