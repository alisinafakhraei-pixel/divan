import { EntityAvatar } from "@/components/shared/entity-avatar";
import { KindBadge, Thumb, plural, shortDate } from "@/components/home/whats-new/shared";
import type { ActivityFeed, ActivityItem } from "@/lib/data-access/activity";
import { Button } from "@/components/ui/button";
import { ArrowRight, Radar, ShieldCheck, SquarePlus } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { icon: Radar, title: "It scans", text: "Every day Divan searches the news for Iranian founders and companies worldwide." },
  { icon: ShieldCheck, title: "It checks", text: "Each article is opened and verified. Anything it can't prove is dropped." },
  { icon: SquarePlus, title: "It adds", text: "New people, companies and stories appear here, each linked to its source." },
];

function dayLabel(daysAgo: number, date: string): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return shortDate(date, { weekday: "long", month: "short", day: "numeric" });
}

function Row({ item }: { item: ActivityItem }) {
  const profile = item.kind === "person" || item.kind === "startup";
  return (
    <Link href={item.href} className="group flex gap-3 rounded-2xl border border-border bg-background p-3 transition-shadow hover:shadow-md">
      {profile ? (
        <EntityAvatar name={item.title} image={item.image} square={item.kind === "startup"} className="size-14" />
      ) : item.kind === "news" ? (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Thumb src={item.image} />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <KindBadge kind={item.kind} />
          {item.source ? <span className="truncate text-xs text-muted-foreground">{item.source}</span> : null}
        </div>
        <p className="mt-1 font-semibold text-foreground group-hover:underline">{item.title}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.kind === "vouch" ? `“${item.blurb}”` : profile ? item.subtitle : item.blurb}</p>
      </div>
    </Link>
  );
}

/** The last 7 days as a timeline, with a "how it works" card beside it and a button to the full news page at the end. */
export function WhatsNewTimeline({ feed }: { feed: ActivityFeed }) {
  const days: { daysAgo: number; date: string; items: ActivityItem[] }[] = [];
  for (const item of feed.all.filter((i) => i.daysAgo <= 6)) {
    const last = days[days.length - 1];
    if (last && last.date === item.date) last.items.push(item);
    else days.push({ daysAgo: item.daysAgo, date: item.date, items: [item] });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-24">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">How it works</h3>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-muted/60 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-action-blue shadow-sm">
                <step.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ol className="relative space-y-8 border-l-2 border-border pl-6 sm:pl-8">
        {days.map((day) => (
          <li key={day.date} className="relative">
            <span className="absolute top-1.5 -left-[calc(1.5rem+7px)] size-3 rounded-full border-2 border-background bg-action-blue ring-2 ring-action-blue/30 sm:-left-[calc(2rem+7px)]" />
            <div className="mb-3 flex items-baseline gap-3">
              <h3 className="text-lg font-bold text-foreground">{dayLabel(day.daysAgo, day.date)}</h3>
              <span className="text-sm text-muted-foreground">{plural(day.items.length, "update", "updates")}</span>
            </div>
            <div className="space-y-2">
              {day.items.map((item) => (
                <Row key={`${item.kind}-${item.id}`} item={item} />
              ))}
            </div>
          </li>
        ))}
        {days.length === 0 ? <li className="text-sm text-muted-foreground">Nothing new in the last 7 days. Check back tomorrow.</li> : null}

        <li className="relative">
          <span className="absolute top-5 -left-[calc(1.5rem+7px)] size-3 rounded-full border-2 border-action-blue bg-background sm:-left-[calc(2rem+7px)]" />
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-accent/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-foreground">That&apos;s the last 7 days.</p>
              <p className="text-sm text-muted-foreground">Want more? Watch all the news, new faces and older stories.</p>
            </div>
            <Button variant="accent" render={<Link href="/news" />} className="shrink-0">
              Watch all the news
              <ArrowRight />
            </Button>
          </div>
        </li>
      </ol>
    </div>
  );
}
