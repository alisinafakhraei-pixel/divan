import { EntityAvatar } from "@/components/shared/entity-avatar";
import { KindBadge, whenLabel } from "@/components/home/whats-new/shared";
import { Thumb } from "@/components/shared/thumb";
import type { ActivityItem } from "@/lib/data-access/activity";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionLabel({ title, hint, href, cta }: { title: string; hint: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      {href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-action-blue hover:underline">
          {cta} <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

/** The big story: full-bleed image, headline over a dark gradient. */
export function LeadStory({ item }: { item: ActivityItem }) {
  return (
    <Link href={item.href} className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-foreground">
      <Thumb src={item.image} className="transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      <div className="relative space-y-3 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <KindBadge kind="news" />
          <span className="opacity-80">
            {item.source} · {whenLabel(item)}
          </span>
        </div>
        <p className="text-2xl leading-tight font-extrabold sm:text-3xl">{item.title}</p>
        {item.blurb ? <p className="line-clamp-2 max-w-2xl text-sm text-white/80">{item.blurb}</p> : null}
        <span className="inline-flex items-center gap-1 text-sm font-semibold">
          Read the story <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** A compact story: thumbnail left, headline right. */
export function StoryRow({ item }: { item: ActivityItem }) {
  return (
    <Link href={item.href} className="group flex flex-1 gap-3 rounded-2xl border border-border bg-background p-3 transition-shadow hover:shadow-md">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Thumb src={item.image} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-3 text-sm font-semibold text-foreground">{item.title}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {item.source} · {whenLabel(item)}
        </p>
      </div>
    </Link>
  );
}

/** A new person or company, as a scrollable card. */
export function FaceCard({ item }: { item: ActivityItem }) {
  return (
    <Link
      href={item.href}
      className="group relative flex w-60 shrink-0 snap-start flex-col rounded-2xl border border-border bg-background p-4 transition-shadow hover:shadow-md"
    >
      <span className="absolute top-3 right-3 rounded-full bg-action-blue px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">New</span>
      <EntityAvatar name={item.title} image={item.image} square={item.kind === "startup"} className="size-16" />
      <p className="mt-3 truncate font-semibold text-foreground">{item.title}</p>
      <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>
      {item.blurb ? <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{item.blurb}</p> : null}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <KindBadge kind={item.kind} />
        <span className="text-xs text-muted-foreground">{whenLabel(item)}</span>
      </div>
      {item.source ? <p className="mt-2 truncate text-[11px] text-muted-foreground">Found in {item.source}</p> : null}
    </Link>
  );
}
