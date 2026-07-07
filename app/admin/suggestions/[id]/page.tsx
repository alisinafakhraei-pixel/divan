import { ReviewEditSubmission } from "@/components/admin/review-edit-submission";
import { ReviewNewSubmission } from "@/components/admin/review-new-submission";
import {
  getPersonFields,
  getStartupFields,
  personToFieldValues,
  startupToFieldValues,
} from "@/components/contribute/suggest-form-fields";
import { getPersonById } from "@/lib/data-access/people";
import { getStartupById, getStartups } from "@/lib/data-access/startups";
import { getSubmissionById } from "@/lib/data-access/submissions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminSuggestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmissionById(id);
  if (!submission) notFound();

  const companyOptions = (await getStartups()).map((s) => s.name);
  const fields = submission.kind === "person" ? getPersonFields(companyOptions) : getStartupFields();

  if (submission.mode === "new") {
    return (
      <div className="space-y-4 pt-6">
        <Link href="/admin" className="text-sm font-medium text-action-blue hover:underline">
          ← Back to suggestions
        </Link>
        <ReviewNewSubmission submissionId={submission.id} fields={fields} payload={submission.payload} />
      </div>
    );
  }

  let targetName: string;
  let oldValues: Record<string, string>;

  if (submission.kind === "person") {
    const target = submission.targetId ? await getPersonById(submission.targetId) : undefined;
    if (!target) notFound();
    targetName = target.name;
    oldValues = personToFieldValues(target);
  } else {
    const target = submission.targetId ? await getStartupById(submission.targetId) : undefined;
    if (!target) notFound();
    const founderNames = (await Promise.all(target.founderIds.map((founderId) => getPersonById(founderId)))).map(
      (p) => p?.name
    ).filter((name): name is string => Boolean(name));
    targetName = target.name;
    oldValues = startupToFieldValues(target, founderNames);
  }

  return (
    <div className="space-y-4 pt-6">
      <Link href="/admin" className="text-sm font-medium text-action-blue hover:underline">
        ← Back to suggestions
      </Link>
      <p className="text-sm text-muted-foreground">
        Suggested edit to <span className="font-medium text-foreground">{targetName}</span>
      </p>
      <ReviewEditSubmission
        submissionId={submission.id}
        fields={fields}
        oldValues={oldValues}
        newValues={submission.payload}
      />
    </div>
  );
}
