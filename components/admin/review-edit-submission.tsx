"use client";

import { FormFieldInput } from "@/components/contribute/form-field-input";
import type { SuggestFormField } from "@/components/contribute/suggest-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ReviewEditSubmissionProps {
  fields: SuggestFormField[];
  oldValues: Record<string, string>;
  newValues: Record<string, string>;
}

/** Admin review for a proposed edit to an existing person/startup — shows old → new per field, editable before approving. */
export function ReviewEditSubmission({ fields, oldValues, newValues }: ReviewEditSubmissionProps) {
  const [decision, setDecision] = useState<"approved" | "cancelled" | null>(null);

  if (decision === "approved") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
        <Check className="size-4" />
        Approved — the record has been updated.
      </div>
    );
  }
  if (decision === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
        <X className="size-4" />
        Cancelled — the record is unchanged.
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setDecision("approved");
      }}
    >
      {fields.map((field) => {
        const oldValue = oldValues[field.name] ?? "";
        const newValue = newValues[field.name] ?? "";
        const changed = field.type !== "file" && oldValue !== newValue;

        return (
          <div
            key={field.name}
            className={changed ? "space-y-1.5 rounded-xl border border-action-blue/30 bg-action-blue/5 p-3" : "space-y-1.5"}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{field.label}</span>
              {changed ? (
                <Badge variant="secondary" className="text-action-blue">
                  Changed
                </Badge>
              ) : null}
            </div>
            {changed ? (
              <p className="text-xs text-muted-foreground">
                <span className="line-through">{oldValue || "—"}</span>
                {" → "}
                <span className="font-medium text-foreground">{newValue || "—"}</span>
              </p>
            ) : null}
            <FormFieldInput field={{ ...field, label: "" }} defaultValue={newValue} />
          </div>
        );
      })}
      <div className="flex gap-2">
        <Button type="submit" variant="accent">
          <Check className="size-4" />
          Approve
        </Button>
        <Button type="button" variant="outline" onClick={() => setDecision("cancelled")}>
          <X className="size-4" />
          Cancel suggestion
        </Button>
      </div>
    </form>
  );
}
