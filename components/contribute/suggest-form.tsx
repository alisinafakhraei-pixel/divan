"use client";

import { submitEditSuggestion, submitNewEntity } from "@/app/actions/contribute";
import { adminPublishDirect, adminUpdateDirect } from "@/app/actions/admin";
import { FormFieldInput } from "@/components/contribute/form-field-input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

export interface SuggestFormField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "select" | "combobox" | "file";
  options?: string[];
  allowCreate?: boolean;
  maxSizeBytes?: number;
  helpText?: string;
  required?: boolean;
}

type SuggestFormMode = "contribute-new" | "contribute-edit" | "admin-add" | "admin-edit";

interface SuggestFormProps {
  fields: SuggestFormField[];
  submitLabel: string;
  kind: "person" | "startup";
  mode: SuggestFormMode;
  /** Required when mode is "contribute-edit" or "admin-edit" — the Person/Startup id being edited. */
  targetId?: string;
  defaultValues?: Record<string, string>;
  successMessage?: string;
}

/** Schema-matched form backed by real server actions (data/*.json is the database) — see app/actions. */
export function SuggestForm({
  fields,
  submitLabel,
  kind,
  mode,
  targetId,
  defaultValues,
  successMessage = "Thanks for the submission — it's in our moderation queue.",
}: SuggestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
        <Check className="size-4" />
        {successMessage}
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setPending(true);
        setError(null);
        try {
          if (mode === "contribute-new") {
            await submitNewEntity(kind, formData);
          } else if (mode === "contribute-edit") {
            await submitEditSuggestion(kind, targetId!, formData);
          } else if (mode === "admin-edit") {
            await adminUpdateDirect(kind, targetId!, formData);
          } else {
            await adminPublishDirect(kind, formData);
          }
          setSubmitted(true);
        } catch {
          setError("Something went wrong — please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      {fields.map((field) => (
        <FormFieldInput key={field.name} field={field} defaultValue={defaultValues?.[field.name]} />
      ))}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );
}
