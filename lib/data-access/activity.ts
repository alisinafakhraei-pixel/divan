import { getNews } from "@/lib/data-access/news";
import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import { getAllPublicVouches } from "@/lib/data-access/vouches";
import type { NewsItem } from "@/lib/types";

export type ActivityKind = "person" | "startup" | "news" | "vouch";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  /** Whole days before today (0 = today). */
  daysAgo: number;
  /** Extra one-line context: a story's summary, a person's bio, a company's category. */
  blurb?: string;
  /** Where the item came from (publisher or "Divan AI"), when known. */
  source?: string;
  country?: string;
  /** True when the Divan AI found and added it automatically. */
  auto?: boolean;
}

export interface ActivityBucket {
  key: "today" | "week" | "lastWeek";
  label: string;
  /** Everything that happened in this window (the list shown is capped, the count is not). */
  total: number;
  items: ActivityItem[];
}

export interface ActivityFeed {
  buckets: ActivityBucket[];
  /** Every item from the last 14 days, newest first (the buckets cap their lists; this does not). */
  all: ActivityItem[];
  /** Counts for the last 7 days (today included). */
  summary: Record<ActivityKind, number>;
}

const TIME_ZONE = "America/Toronto";
const MS_PER_DAY = 86_400_000;
const CAPS = { today: 6, week: 8, lastWeek: 8 } as const;

function daysAgo(date: string, today: string): number {
  return Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / MS_PER_DAY);
}

export function todayInToronto(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

/** A saved news story in the same shape as the timeline items, so the same cards can show either. */
export function newsToActivity(n: NewsItem, today = todayInToronto()): ActivityItem {
  return {
    id: n.id,
    kind: "news",
    date: n.date,
    daysAgo: Math.max(0, daysAgo(n.date, today)),
    title: n.title,
    subtitle: n.sourceName ? `${n.sourceName} · ${n.type}` : n.type,
    href: `/news/${n.slug}`,
    image: n.image,
    blurb: n.tldr,
    source: n.sourceName ?? n.submittedBy,
    auto: n.auto,
  };
}

/**
 * One timeline of everything new on Divan — people and startups added, stories published, vouches given — grouped
 * into Today / This week / Last week. Built live from the data, so it needs no upkeep.
 */
export async function getActivityFeed(now = new Date()): Promise<ActivityFeed> {
  const today = todayInToronto(now);
  const [people, startups, news, vouches] = await Promise.all([getPeople(), getStartups(), getNews(), getAllPublicVouches()]);
  const peopleById = new Map(people.map((p) => [p.id, p]));

  const items: Omit<ActivityItem, "daysAgo">[] = [];
  for (const p of people) {
    if (p.addedAt) {
      items.push({ id: p.id, kind: "person", date: p.addedAt, title: p.name, subtitle: `${p.title} · ${p.knownFor}`, href: `/entrepreneurs/${p.slug}`, image: p.picture, blurb: p.bio, source: p.auto ? p.sourceName : undefined, country: p.country, auto: p.auto });
    }
  }
  for (const s of startups) {
    if (s.addedAt) {
      items.push({ id: s.id, kind: "startup", date: s.addedAt, title: s.name, subtitle: s.tagline, href: `/startups/${s.slug}`, image: s.logo, blurb: s.mainCategory, source: s.auto ? s.sourceName : undefined, country: s.hqCountry, auto: s.auto });
    }
  }
  for (const n of news) {
    items.push({ id: n.id, kind: "news", date: n.date, title: n.title, subtitle: n.sourceName ? `${n.sourceName} · ${n.type}` : n.type, href: `/news/${n.slug}`, image: n.image, blurb: n.tldr, source: n.sourceName, auto: n.auto });
  }
  for (const v of vouches) {
    const person = peopleById.get(v.personId);
    if (person) {
      items.push({ id: v.id, kind: "vouch", date: v.createdAt, title: `${v.voucherName} vouched for ${person.name}`, subtitle: v.relationship, href: `/entrepreneurs/${person.slug}`, blurb: v.message });
    }
  }

  const windows: { key: ActivityBucket["key"]; label: string; match: (d: number) => boolean }[] = [
    { key: "today", label: "Today", match: (d) => d <= 0 },
    { key: "week", label: "This week", match: (d) => d >= 1 && d <= 6 },
    { key: "lastWeek", label: "Last week", match: (d) => d >= 7 && d <= 13 },
  ];

  const sorted: ActivityItem[] = items
    .map((i) => ({ ...i, daysAgo: Math.max(0, daysAgo(i.date, today)) }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.kind.localeCompare(b.kind)));
  const buckets: ActivityBucket[] = windows.map((w) => {
    const inWindow = sorted.filter((i) => w.match(i.daysAgo));
    return { key: w.key, label: w.label, total: inWindow.length, items: inWindow.slice(0, CAPS[w.key]) };
  });

  const summary: ActivityFeed["summary"] = { person: 0, startup: 0, news: 0, vouch: 0 };
  for (const i of sorted) if (i.daysAgo <= 6) summary[i.kind] += 1;

  return { buckets, all: sorted.filter((i) => i.daysAgo <= 13), summary };
}
