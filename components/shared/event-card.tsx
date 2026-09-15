import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import type { DivanEvent } from "@/lib/types";
import { CalendarDays, MapPin } from "lucide-react";

export function formatEventDate(event: DivanEvent): string {
  if (event.dateLabel) return event.dateLabel;
  const parsed = new Date(`${event.date}T00:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function EventCard({ event }: { event: DivanEvent }) {
  const cover = event.images?.[0];

  return (
    <CardShell href={`/events/${event.slug}`} className="group overflow-hidden p-0 sm:p-0">
      {cover ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-secondary">
          <img
            src={cover}
            alt={event.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="p-4 sm:p-5">
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
        {event.isPast && event.writeup ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.writeup}</p>
        ) : null}
      </div>
    </CardShell>
  );
}
