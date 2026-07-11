import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { EntityStatusControl } from "@/components/admin/entity-status-control";
import { SuggestForm } from "@/components/contribute/suggest-form";
import { getPersonFields, personToFieldValues } from "@/components/contribute/suggest-form-fields";
import { getPersonById } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import { getPendingEditSubmission } from "@/lib/data-access/submissions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminManagePersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [person, startups, pendingEdit] = await Promise.all([
    getPersonById(id),
    getStartups(),
    getPendingEditSubmission("person", id),
  ]);
  if (!person) notFound();

  return (
    <div className="space-y-4 pt-6">
      <Link href="/admin/manage" className="text-sm font-medium text-action-blue hover:underline">
        ← Back to search
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{person.name}</h2>
        <DeleteEntityButton kind="person" targetId={person.id} name={person.name} />
      </div>
      <div className="flex items-center justify-between">
        <EntityStatusControl kind="person" targetId={person.id} status={pendingEdit ? "pending" : person.status} />
        <p className="text-xs text-muted-foreground">Last updated {person.lastUpdatedAt}</p>
      </div>
      {pendingEdit ? (
        <p className="text-sm text-muted-foreground">
          Showing as Pending because of an{" "}
          <Link href={`/admin/suggestions/${pendingEdit.id}`} className="font-medium text-action-blue hover:underline">
            unreviewed edit suggestion
          </Link>
          .
        </p>
      ) : null}
      <SuggestForm
        fields={getPersonFields(startups.map((s) => s.name))}
        kind="person"
        mode="admin-edit"
        targetId={person.id}
        defaultValues={personToFieldValues(person)}
        submitLabel="Save changes"
        successMessage="Saved — changes are live on the site now."
      />
    </div>
  );
}
