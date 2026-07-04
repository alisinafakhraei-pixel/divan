import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DivanEvent } from "@/lib/types";

export function EventCard({ event }: { event: DivanEvent }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="sky">{event.date}</Badge>
        <span className="text-xs text-muted-foreground">{event.city}</span>
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
