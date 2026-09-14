"use client";

import type { DivanEvent } from "@/lib/types";
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

function scrollToEvent(slug: string) {
  document.getElementById(`event-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function EventsMap({ events }: { events: DivanEvent[] }) {
  const markers = events.filter((e) => CITY_COORDS[e.city]);

  // react-simple-maps' SVG output isn't SSR-stable (mismatches on hydration), so render it client-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="aspect-[2/1] w-full rounded-xl border border-border bg-secondary/30" />;
  }

  return (
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
              fillOpacity={0.85}
              stroke="#ffffff"
              strokeWidth={1.5}
              className="cursor-pointer"
              onClick={() => scrollToEvent(event.slug)}
            >
              <title>
                {event.title} — {event.city}
              </title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
