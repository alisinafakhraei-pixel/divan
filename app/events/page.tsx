import { EmptyState } from "@/components/shared/empty-state";
import { EventCard } from "@/components/shared/event-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPastEvents, getUpcomingEvents } from "@/lib/data-access/events";

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Divan"
        muted="events"
        subhead="Founder mixers, hackathon demo days, and community meetups around the world."
      />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="pt-6">
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming events" description="Check back soon." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="pt-6">
          {past.length === 0 ? (
            <EmptyState title="No past events yet" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
