import { ExternalLink } from "lucide-react";
import type { Startup } from "@/lib/types";
import type { ReactNode } from "react";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

export function StartupInfoPanel({ startup }: { startup: Startup }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <p className="mb-1 text-sm font-semibold text-foreground">At a glance</p>
      <div className="flex justify-between gap-4 py-3 text-sm">
        <span className="text-muted-foreground">Website</span>
        <a
          href={startup.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-action-blue hover:underline"
        >
          Visit
          <ExternalLink className="size-3" />
        </a>
      </div>
      <Row label="HQ">
        {startup.hqCountry} ({startup.hqRegion})
      </Row>
      <Row label="Industries">{startup.industries.join(", ")}</Row>
      <Row label="Main category">{startup.mainCategory}</Row>
      <Row label="Team size">{startup.teamSize}</Row>
      <Row label="Founded">{startup.foundedYear}</Row>
    </div>
  );
}
