import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { SuggestForm } from "@/components/contribute/suggest-form";
import { getPersonFields, personToFieldValues } from "@/components/contribute/suggest-form-fields";
import { getPersonById } from "@/lib/data-access/people";
import { getStartups } from "@/lib/data-access/startups";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminManagePersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [person, startups] = await Promise.all([getPersonById(id), getStartups()]);
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
