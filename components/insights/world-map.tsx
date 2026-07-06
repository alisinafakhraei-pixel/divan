"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { PersonCard } from "@/components/shared/person-card";
import { StartupCard } from "@/components/shared/startup-card";
import { Button } from "@/components/ui/button";
import { getPeople } from "@/lib/data-access/people";
import { COUNTRY_TOPOJSON_ALIASES, getCountryCounts, type MapMode } from "@/lib/data-access/insights";
import { getStartups } from "@/lib/data-access/startups";
import { cn } from "@/lib/utils";
import { geoCentroid } from "d3-geo";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "/world-110m.json";

const MODES: { value: MapMode; label: string }[] = [
  { value: "both", label: "Both" },
  { value: "startups", label: "Startups" },
  { value: "people", label: "Entrepreneurs" },
];

// Reverse of COUNTRY_TOPOJSON_ALIASES — topojson name -> our fixture's country name.
const TOPO_TO_FIXTURE_ALIAS: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_TOPOJSON_ALIASES).map(([fixture, topo]) => [topo, fixture])
);

export function WorldMap() {
  const [mode, setMode] = useState<MapMode>("both");
  // Stores the topojson country name (every country is clickable, not just ones with data).
  // The sheet's backdrop blocks clicks on the map while open, so a country must be closed
  // before another can be selected — matches the requested "close, then pick again" flow.
  const [selectedTopoName, setSelectedTopoName] = useState<string | null>(null);

  const counts = getCountryCounts(mode);
  const maxCount = Math.max(1, ...counts.map((c) => c.value));

  const countByTopoName = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of counts) map.set(COUNTRY_TOPOJSON_ALIASES[c.label] ?? c.label, c.value);
    return map;
  }, [counts]);

  const selectedFixtureName = selectedTopoName
    ? (TOPO_TO_FIXTURE_ALIAS[selectedTopoName] ?? selectedTopoName)
    : null;

  const selectedPeople =
    selectedFixtureName && mode !== "startups" ? getPeople({ country: selectedFixtureName }) : [];
  const selectedStartups =
    selectedFixtureName && mode !== "people" ? getStartups({ hqCountry: selectedFixtureName }) : [];

  // Close on Escape — a plain CSS panel (not a Dialog primitive) so it can never get stuck open.
  useEffect(() => {
    if (!selectedTopoName) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTopoName(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTopoName]);

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-1 rounded-full border border-border p-1">
        {MODES.map((m) => (
          <Button
            key={m.value}
            size="sm"
            variant={mode === m.value ? "default" : "ghost"}
            onClick={() => {
              setMode(m.value);
              setSelectedTopoName(null);
            }}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
        <ComposableMap projection="geoEqualEarth" style={{ width: "100%", height: "auto" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const count = countByTopoName.get(geo.properties.name) ?? 0;
                  const isSelected = geo.properties.name === selectedTopoName;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => setSelectedTopoName(geo.properties.name)}
                      style={{
                        default: {
                          fill: count > 0 ? "#B3E0FF" : "#F1F2F4",
                          stroke: isSelected ? "#155DFC" : "#ffffff",
                          strokeWidth: isSelected ? 1.5 : 0.5,
                          outline: "none",
                          cursor: "pointer",
                        },
                        hover: {
                          fill: count > 0 ? "#7CC5EE" : "#E5E7EB",
                          stroke: isSelected ? "#155DFC" : "#ffffff",
                          strokeWidth: isSelected ? 1.5 : 0.5,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#155DFC",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    >
                      <title>
                        {geo.properties.name}
                        {count > 0 ? ` — ${count}` : ""}
                      </title>
                    </Geography>
                  );
                })}
                {geographies.map((geo) => {
                  const count = countByTopoName.get(geo.properties.name) ?? 0;
                  if (count === 0) return null;
                  const radius = 4 + (count / maxCount) * 10;
                  return (
                    <Marker key={`${geo.rsmKey}-marker`} coordinates={geoCentroid(geo)}>
                      <circle
                        r={radius}
                        fill="#155DFC"
                        fillOpacity={0.8}
                        stroke="#ffffff"
                        strokeWidth={1}
                        className="cursor-pointer"
                        onClick={() => setSelectedTopoName(geo.properties.name)}
                      >
                        <title>
                          {geo.properties.name} — {count}
                        </title>
                      </circle>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>

      <p className="text-sm text-muted-foreground">Click any country to see who's there.</p>

      {/* Plain CSS slide-in panel, not a Dialog primitive — pointer-events tracks React state
          directly instead of an animation-completion callback, so it can never get stuck open. */}
      <div
        aria-hidden={!selectedTopoName}
        onClick={() => setSelectedTopoName(null)}
        className={cn(
          "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150",
          selectedTopoName ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedFixtureName ?? "Country details"}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-popover shadow-lg transition-transform duration-200 ease-in-out",
          selectedTopoName ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <p className="font-medium text-foreground">{selectedFixtureName}</p>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setSelectedTopoName(null)}>
            <X />
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {selectedStartups.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{selectedStartups.length} startups</p>
                {selectedFixtureName ? (
                  <Link
                    href={`/startups?hqCountry=${encodeURIComponent(selectedFixtureName)}`}
                    className="text-sm font-medium text-action-blue hover:underline"
                  >
                    View all
                  </Link>
                ) : null}
              </div>
              <div className="space-y-3">
                {selectedStartups.map((s) => (
                  <StartupCard key={s.id} startup={s} />
                ))}
              </div>
            </div>
          ) : null}

          {selectedPeople.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{selectedPeople.length} entrepreneurs</p>
                {selectedFixtureName ? (
                  <Link
                    href={`/entrepreneurs?country=${encodeURIComponent(selectedFixtureName)}`}
                    className="text-sm font-medium text-action-blue hover:underline"
                  >
                    View all
                  </Link>
                ) : null}
              </div>
              <div className="space-y-3">
                {selectedPeople.map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>
          ) : null}

          {selectedFixtureName && selectedPeople.length === 0 && selectedStartups.length === 0 ? (
            <EmptyState
              title={`No results for ${selectedFixtureName}`}
              description="Nobody in the current view is based here yet."
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
