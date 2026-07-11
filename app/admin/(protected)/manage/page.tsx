import { ManageSearch, type ManageEntity } from "@/components/admin/manage-search";
import { getPeople } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import { getPendingSubmissions } from "@/lib/data-access/submissions";

export default async function AdminManagePage() {
  const [people, startups, pendingSubmissions] = await Promise.all([
    getPeople(),
    getStartups(),
    getPendingSubmissions(),
  ]);

  // An entity with a pending edit suggestion shows as "Pending" here even though it's still live —
  // the suggestion, not the record itself, is what's awaiting review.
  const pendingEditTargets = new Set(
    pendingSubmissions.filter((s) => s.mode === "edit" && s.targetId).map((s) => `${s.kind}-${s.targetId}`)
  );

  const entities: ManageEntity[] = [
    ...people.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: `${p.title} · ${p.knownFor}`,
      kind: "person" as const,
      status: pendingEditTargets.has(`person-${p.id}`) ? ("pending" as const) : p.status,
    })),
    ...startups.map((s) => ({
      id: s.id,
      name: s.name,
      subtitle: s.tagline,
      kind: "startup" as const,
      status: pendingEditTargets.has(`startup-${s.id}`) ? ("pending" as const) : s.status,
    })),
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
