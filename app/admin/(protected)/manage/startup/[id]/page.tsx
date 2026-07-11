import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { EntityStatusControl } from "@/components/admin/entity-status-control";
import { SuggestForm } from "@/components/contribute/suggest-form";
import { getStartupFields, startupToFieldValues } from "@/components/contribute/suggest-form-fields";
import { getPersonById } from "@/lib/data-access/people";
import { getStartupById } from "@/lib/data-access/startups";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminManageStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startup = await getStartupById(id);
  if (!startup) notFound();

  const founderNames = (await Promise.all(startup.founderIds.map((founderId) => getPersonById(founderId))))
    .map((p) => p?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="space-y-4 pt-6">
      <Link href="/admin/manage" className="text-sm font-medium text-action-blue hover:underline">
        ← Back to search
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{startup.name}</h2>
        <DeleteEntityButton kind="startup" targetId={startup.id} name={startup.name} />
      </div>
      <div className="flex items-center justify-between">
        <EntityStatusControl kind="startup" targetId={startup.id} status={startup.status} />
        <p className="text-xs text-muted-foreground">Last updated {startup.lastUpdatedAt}</p>
      </div>
      <SuggestForm
        fields={getStartupFields()}
        kind="startup"
        mode="admin-edit"
        targetId={startup.id}
        defaultValues={startupToFieldValues(startup, founderNames)}
        submitLabel="Save changes"
        successMessage="Saved — changes are live on the site now."
      />
    </div>
  );
}
