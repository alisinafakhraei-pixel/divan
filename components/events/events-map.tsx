"use client";

import { EventCard } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import type { DivanEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "/world-110m.json";

// [longitude, latitude] — only the cities we actually run events in.
const CITY_COORDS: Record<string, [number, number]> = {
  Stockholm: [18.0686, 59.3293],
  Toronto: [-79.3832, 43.6532],
  London: [-0.1278, 51.5074],
  "San Francisco": [-122.4194, 37.7749],
  Sydney: [151.2093, -33.8688],
  Paris: [2.3522, 48.8566],
};

export function EventsMap({ events }: { events: DivanEvent[] }) {
  const markers = events.filter((e) => CITY_COORDS[e.city]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const selectedEvents = events.filter((e) => e.city === selectedCity);

  // react-simple-maps' SVG output isn't SSR-stable (mismatches on hydration), so render it client-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selectedCity) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCity(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCity]);

  if (!mounted) {
    return <div className="aspect-[2/1] w-full rounded-xl border border-border bg-secondary/30" />;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
        <ComposableMap projection="geoEqualEarth" style={{ width: "100%", height: "auto" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#F1F2F4", stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#F1F2F4", stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                    pressed: { fill: "#F1F2F4", stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map((event) => (
            <Marker key={event.id} coordinates={CITY_COORDS[event.city]}>
              <circle
                r={7}
                fill="#155DFC"
                fillOpacity={event.city === selectedCity ? 1 : 0.85}
                stroke="#ffffff"
                strokeWidth={event.city === selectedCity ? 2.5 : 1.5}
                className="cursor-pointer"
                onClick={() => setSelectedCity(event.city)}
              >
                <title>
                  {event.title} — {event.city}
                </title>
              </circle>
              {event.country ? (
                <text
                  textAnchor="middle"
                  y={19}
                  className="pointer-events-none select-none"
                  style={{ fontSize: 9, fontWeight: 600, fill: "#4B5563" }}
                >
                  {event.country}
                </text>
              ) : null}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Plain CSS slide-in panel — mirrors the country panel on the home page's Global reach map. */}
      <div
        aria-hidden={!selectedCity}
        onClick={() => setSelectedCity(null)}
        className={cn(
          "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150",
          selectedCity ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedCity ?? "Event details"}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-border bg-popover shadow-lg transition-transform duration-200 ease-in-out",
          selectedCity ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <p className="font-medium text-foreground">{selectedCity}</p>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setSelectedCity(null)}>
            <X />
          </Button>
        </div>
        <div className="space-y-3 p-4">
          {selectedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
