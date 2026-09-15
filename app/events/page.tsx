import { EventCard } from "@/components/shared/event-card";
import { EventsMap } from "@/components/events/events-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPastEvents, getUpcomingEvents } from "@/lib/data-access/events";

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Divan"
        muted="events"
        subhead="Founder mixers, hackathon demo days, and community meetups around the world."
      />

      <section className="space-y-4">
        <SectionHeading bold="Upcoming" muted="events" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {past.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading bold="Past" muted="events" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionHeading bold="Where" muted="we'll be" />
        <EventsMap events={[...upcoming, ...past]} />
        <p className="text-sm text-muted-foreground">Click a pin to see the event there.</p>
      </section>
    </div>
  );
}
