import { ExternalLink } from "lucide-react";
import type { Person } from "@/lib/types";
import type { ReactNode } from "react";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

export function PersonInfoPanel({ person }: { person: Person }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <p className="mb-1 text-sm font-semibold text-foreground">At a glance</p>
      {person.previousCompanies.length > 0 ? (
        <Row label="Previous companies">{person.previousCompanies.join(", ")}</Row>
      ) : null}
      <Row label="Country">{person.country}</Row>
      {person.valuation ? <Row label="Valuation">{person.valuation}</Row> : null}
      {person.additionalInfo.length > 0 ? (
        <div className="flex justify-between gap-4 py-3 text-sm">
          <span className="text-muted-foreground">Links</span>
          <div className="flex flex-col items-end gap-1">
            {person.additionalInfo.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-action-blue hover:underline"
              >
                {link.label}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
