"use client";

import { FormFieldInput } from "@/components/contribute/form-field-input";
import type { SuggestFormField } from "@/components/contribute/suggest-form";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ReviewNewSubmissionProps {
  fields: SuggestFormField[];
  payload: Record<string, string>;
}

/** Admin review for a brand-new person/startup submission — no approval workflow, publishing is immediate (mock, no persistence). */
export function ReviewNewSubmission({ fields, payload }: ReviewNewSubmissionProps) {
  const [decision, setDecision] = useState<"published" | "declined" | null>(null);

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

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setDecision("published");
      }}
    >
      {fields.map((field) => (
        <FormFieldInput key={field.name} field={field} defaultValue={payload[field.name]} />
      ))}
      <div className="flex gap-2">
        <Button type="submit" variant="accent">
          <Check className="size-4" />
          Publish
        </Button>
        <Button type="button" variant="destructive" onClick={() => setDecision("declined")}>
          <X className="size-4" />
          Decline
        </Button>
      </div>
    </form>
  );
}
