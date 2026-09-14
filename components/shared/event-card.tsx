import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DivanEvent } from "@/lib/types";
import { CalendarDays, MapPin } from "lucide-react";

function formatEventDate(event: DivanEvent): string {
  if (event.dateLabel) return event.dateLabel;
  const parsed = new Date(`${event.date}T00:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function EventCard({ event }: { event: DivanEvent }) {
  return (
    <CardShell id={`event-${event.slug}`}>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="sky" className="shrink-0 gap-1">
          <CalendarDays className="size-3" />
          {formatEventDate(event)}
        </Badge>
        <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{event.city}</span>
        </span>
      </div>
      <p className="mt-3 font-semibold text-foreground">{event.title}</p>
      {!event.isPast ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          render={<a href={event.rsvpLink} target="_blank" rel="noopener noreferrer" />}
        >
          RSVP
        </Button>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{event.writeup}</p>
      )}
    </CardShell>
  );
}
