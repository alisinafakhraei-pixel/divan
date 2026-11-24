import { hideAutoEntity } from "@/app/actions/auto-added";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { readAutoPeople } from "@/lib/data/people";
import { readAutoStartups } from "@/lib/data/startups";
import Link from "next/link";

export default async function AdminAutoAddedPage() {
  const [people, startups] = await Promise.all([readAutoPeople(), readAutoStartups()]);
  const rows = [
    ...people.map((p) => ({ kind: "person" as const, id: p.id, name: p.name, detail: `${p.title} · ${p.knownFor}`, href: `/entrepreneurs/${p.slug}`, addedAt: p.addedAt, source: p.sourceName, sourceUrl: p.sourceUrl, image: p.picture })),
    ...startups.map((s) => ({ kind: "startup" as const, id: s.id, name: s.name, detail: s.tagline, href: `/startups/${s.slug}`, addedAt: s.addedAt, source: s.sourceName, sourceUrl: s.sourceUrl, image: s.logo })),
  ].sort((a, b) => ((a.addedAt ?? "") < (b.addedAt ?? "") ? 1 : -1));

  return (
    <div className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground">
        People and companies the Divan AI added from news articles. They are live straight away. Hide one if it&apos;s wrong: it&apos;s removed and never auto-added again.
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing has been added automatically yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={`${row.kind}-${row.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <EntityAvatar name={row.name} image={row.image} square={row.kind === "startup"} />
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={row.href} className="font-semibold text-foreground hover:underline">
                    {row.name}
                  </Link>
                  <Badge variant={row.kind === "person" ? "sky" : "success"}>{row.kind === "person" ? "Entrepreneur" : "Startup"}</Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{row.detail}</p>
                <p className="text-xs text-muted-foreground">
                  {row.addedAt} ·{" "}
                  {row.sourceUrl ? (
                    <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-action-blue hover:underline">
                      {row.source ?? "source"}
                    </a>
                  ) : (
                    row.source
                  )}
                </p>
              </div>
              <form action={hideAutoEntity.bind(null, row.kind, row.id)}>
                <Button type="submit" size="sm" variant="outline">
                  Hide
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
