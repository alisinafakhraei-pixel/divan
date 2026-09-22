import { EventCard, formatEventDate } from "@/components/shared/event-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllEventSlugs, getEventBySlug, getOtherEvents } from "@/lib/data-access/events";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const title = `${event.title} | Divan Events`;
  const description = event.description ?? event.writeup ?? `${event.title} — a Divan community event.`;

  return {
    title,
    description,
    openGraph: { title, description, images: event.images?.[0] ? [event.images[0]] : undefined },
    twitter: { title, description },
  };
}

export function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const images = event.images ?? [];
  const [cover, ...rest] = images;
  const otherEvents = getOtherEvents(event.slug);

  const meta = (
    <>
      <Badge variant="sky" className="gap-1">
        <CalendarDays className="size-3" />
        {formatEventDate(event)}
      </Badge>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
      <p className="mt-1.5 flex items-center gap-1 opacity-80">
        <MapPin className="size-4" />
        {event.city}
        {event.country ? `, ${event.country}` : ""}
      </p>
    </>
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <Link
        href="/events"
        className="-ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All events
      </Link>

      {cover ? (
        <div className="grid gap-2 overflow-hidden rounded-2xl shadow-sm sm:grid-cols-4 sm:grid-rows-2">
          <div className="group relative aspect-[4/3] overflow-hidden bg-secondary sm:col-span-2 sm:row-span-2 sm:aspect-auto">
            <img
              src={cover}
              alt={event.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 pt-20 text-white sm:p-8 sm:pt-28">
              {meta}
            </div>
          </div>
          {rest.map((src, i) => (
            <div key={src + i} className="hidden aspect-square overflow-hidden bg-secondary sm:block">
              <img src={src} alt={`${event.title} photo ${i + 2}`} className="size-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-foreground">{meta}</div>
      )}

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="font-semibold text-foreground">
            {event.isPast ? "This event has ended" : event.rsvpLink ? "Save your spot" : "Details coming soon"}
          </p>
          <p className="text-sm text-muted-foreground">Hosted by Divan</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ShareButtons title={event.title} />
          {!event.isPast && event.rsvpLink ? (
            <Button
              size="lg"
              variant="accent"
              className="w-full sm:w-auto"
              render={<a href={event.rsvpLink} target="_blank" rel="noopener noreferrer" />}
            >
              Join
            </Button>
          ) : null}
        </div>
      </div>

      {event.description || event.writeup ? (
        <div className="max-w-2xl space-y-2 border-t border-border pt-8">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {event.isPast ? "Recap" : "About this event"}
          </h2>
          <p className="text-foreground">{event.isPast ? (event.writeup ?? event.description) : event.description}</p>
        </div>
      ) : null}

      {otherEvents.length > 0 ? (
        <section className="space-y-4 border-t border-border pt-8">
          <SectionHeading bold="More" muted="Divan events" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {otherEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
