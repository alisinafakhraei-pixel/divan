"use client";

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

interface SuggestFormProps {
  fields: SuggestFormField[];
  submitLabel: string;
  defaultValues?: Record<string, string>;
  successMessage?: string;
}

/** Schema-matched mock submission — no backend, no persistence. Shows a success state on submit. */
export function SuggestForm({
  fields,
  submitLabel,
  defaultValues,
  successMessage = "Thanks for the submission — it's in our moderation queue.",
}: SuggestFormProps) {
  const [submitted, setSubmitted] = useState(false);

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
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {fields.map((field) => (
        <FormFieldInput key={field.name} field={field} defaultValue={defaultValues?.[field.name]} />
      ))}
      <Button type="submit" variant="accent">
        {submitLabel}
      </Button>
    </form>
  );
}
