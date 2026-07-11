import { Badge } from "@/components/ui/badge";
import { getPersonById } from "@/lib/data-access/people";
import { getStartupById } from "@/lib/data-access/startups";
import { getAllSubmissions } from "@/lib/data-access/submissions";
import type { Submission, SubmissionStatus } from "@/lib/types";
import Link from "next/link";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  approved: "Published",
  pending: "Pending",
  declined: "Cancelled",
};

const STATUS_VARIANT: Record<SubmissionStatus, "success" | "warning" | "destructive"> = {
  approved: "success",
  pending: "warning",
  declined: "destructive",
};

/** Community suggestions always come in as "anonymous"; direct admin actions are logged under the acting admin's email. */
function sourceLabel(submittedBy: string): string {
  return submittedBy.includes("@") ? "Admin" : "Community";
}

async function targetName(submission: Submission): Promise<string> {
  if (submission.mode === "new") return submission.payload.name;
  if (!submission.targetId) return submission.payload.name;
  const target =
    submission.kind === "person" ? await getPersonById(submission.targetId) : await getStartupById(submission.targetId);
  return target?.name ?? submission.payload.name;
}

async function targetHref(submission: Submission): Promise<string | undefined> {
  if (!submission.targetId) return undefined;
  const target =
    submission.kind === "person" ? await getPersonById(submission.targetId) : await getStartupById(submission.targetId);
  return target ? `/admin/manage/${submission.kind}/${submission.targetId}` : undefined;
}

export default async function AdminHistoryPage() {
  const submissions = await getAllSubmissions();
  const rows = await Promise.all(
    submissions.map(async (submission) => ({
      submission,
      name: await targetName(submission),
      href: await targetHref(submission),
    }))
  );

  return (
    <div className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground">
        Every add/edit request — from the community or made directly by an admin — with its final status.
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map(({ submission, name, href }) => {
            const row = (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={submission.mode === "new" ? "success" : "sky"}>
                      {submission.mode === "new" ? "New" : "Edit"}
                    </Badge>
                    <Badge variant="secondary">{submission.kind === "person" ? "Person" : "Startup"}</Badge>
                    <Badge variant={STATUS_VARIANT[submission.status]}>{STATUS_LABEL[submission.status]}</Badge>
                  </div>
                  <p className="font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sourceLabel(submission.submittedBy)} · {submission.submittedBy} · {submission.submittedAt}
                  </p>
                </div>
              </div>
            );
            return href ? (
              <Link
                key={submission.id}
                href={href}
                className="block rounded-xl transition-colors hover:opacity-80"
              >
                {row}
              </Link>
            ) : (
              <div key={submission.id}>{row}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
