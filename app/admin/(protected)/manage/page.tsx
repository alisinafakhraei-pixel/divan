import { ManageSearch, type ManageEntity } from "@/components/admin/manage-search";
import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";

export default async function AdminManagePage() {
  const [people, startups] = await Promise.all([getPeople(), getStartups()]);

  const entities: ManageEntity[] = [
    ...people.map((p) => ({ id: p.id, name: p.name, subtitle: `${p.title} · ${p.knownFor}`, kind: "person" as const })),
    ...startups.map((s) => ({ id: s.id, name: s.name, subtitle: s.tagline, kind: "startup" as const })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground">
        Search for an existing entrepreneur or startup to edit their profile or remove it entirely.
      </p>
      <ManageSearch entities={entities} />
    </div>
  );
}
