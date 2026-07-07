import { Badge } from "@/components/ui/badge";
import { getPendingSubmissions } from "@/lib/data-access/submissions";
import { getPersonById } from "@/lib/data-access/people";
import { getStartupById } from "@/lib/data-access/startups";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function targetName(kind: "person" | "startup", targetId?: string): string {
  if (!targetId) return "";
  const target = kind === "person" ? getPersonById(targetId) : getStartupById(targetId);
  return target?.name ?? "Unknown record";
}

export default function AdminSuggestionsPage() {
  const submissions = getPendingSubmissions();

  return (
    <div className="space-y-4 pt-6">
      {submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending suggestions.</p>
      ) : (
        submissions.map((submission) => {
          const title =
            submission.mode === "new"
              ? submission.payload.name
              : `Edit: ${targetName(submission.kind, submission.targetId)}`;

          return (
            <Link
              key={submission.id}
              href={`/admin/suggestions/${submission.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-colors hover:border-foreground"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={submission.mode === "new" ? "success" : "sky"}>
                    {submission.mode === "new" ? "New" : "Edit"}
                  </Badge>
                  <Badge variant="secondary">{submission.kind === "person" ? "Person" : "Startup"}</Badge>
                </div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">Submitted {submission.submittedAt}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })
      )}
    </div>
  );
}
