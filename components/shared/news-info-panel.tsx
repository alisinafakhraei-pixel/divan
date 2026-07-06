import { EntityAvatar } from "@/components/shared/entity-avatar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { NewsItem, Person, Startup } from "@/lib/types";
import type { ReactNode } from "react";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

export function NewsInfoPanel({
  item,
  relatedPeople,
  relatedStartups,
}: {
  item: NewsItem;
  relatedPeople: Person[];
  relatedStartups: Startup[];
}) {
  return (
    <div className="rounded-xl border border-border p-5">
      <p className="mb-1 text-sm font-semibold text-foreground">At a glance</p>
      <div className="flex justify-between gap-4 py-3 text-sm">
        <span className="text-muted-foreground">Source</span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-action-blue hover:underline"
        >
          Visit
          <ExternalLink className="size-3" />
        </a>
      </div>
      <Row label="Type">{item.type}</Row>
      <Row label="Date">{item.date}</Row>
      <Row label="Submitted by">{item.submittedBy}</Row>

      {relatedPeople.length > 0 || relatedStartups.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">Mentioned</p>
          <div className="space-y-2">
            {relatedPeople.map((person) => (
              <Link
                key={person.id}
                href={`/entrepreneurs/${person.slug}`}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
              >
                <EntityAvatar name={person.name} image={person.picture} size="sm" />
                <span className="text-sm font-medium text-foreground">{person.name}</span>
              </Link>
            ))}
            {relatedStartups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.slug}`}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
              >
                <EntityAvatar name={startup.name} image={startup.logo} size="sm" square />
                <span className="text-sm font-medium text-foreground">{startup.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
