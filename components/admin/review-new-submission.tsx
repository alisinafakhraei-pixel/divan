"use client";

import { adminDeclineSubmission, adminPublishSubmission } from "@/app/actions/admin";
import { FormFieldInput } from "@/components/contribute/form-field-input";
import type { SuggestFormField } from "@/components/contribute/suggest-form";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ReviewNewSubmissionProps {
  submissionId: string;
  fields: SuggestFormField[];
  payload: Record<string, string>;
}

/** Admin review for a brand-new person/startup submission — no approval workflow beyond this screen; publishing writes straight to the JSON data files. */
export function ReviewNewSubmission({ submissionId, fields, payload }: ReviewNewSubmissionProps) {
  const [decision, setDecision] = useState<"published" | "declined" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (decision === "published") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
        <Check className="size-4" />
        Published — it&apos;s live on the site now.
      </div>
    );
  }
  if (decision === "declined") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
        <X className="size-4" />
        Declined — removed from the queue.
      </div>
    );
  }

  async function decline() {
    setPending(true);
    setError(null);
    try {
      await adminDeclineSubmission(submissionId);
      setDecision("declined");
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
          await adminPublishSubmission(submissionId, new FormData(e.currentTarget));
          setDecision("published");
        } catch {
          setError("Something went wrong — please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      {fields.map((field) => (
        <FormFieldInput key={field.name} field={field} defaultValue={payload[field.name]} />
      ))}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" variant="accent" disabled={pending}>
          <Check className="size-4" />
          Publish
        </Button>
        <Button type="button" variant="destructive" disabled={pending} onClick={decline}>
          <X className="size-4" />
          Decline
        </Button>
      </div>
    </form>
  );
}
