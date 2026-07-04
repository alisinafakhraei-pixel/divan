"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { useState } from "react";

export interface SuggestFormField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url";
  required?: boolean;
}

interface SuggestFormProps {
  fields: SuggestFormField[];
  submitLabel: string;
}

/** Schema-matched mock submission — no backend, no persistence. Shows a success state on submit. */
export function SuggestForm({ fields, submitLabel }: SuggestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
        <Check className="size-4" />
        Thanks for the submission — it&apos;s in our moderation queue.
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
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea id={field.name} name={field.name} rows={3} required={field.required} />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type === "url" ? "url" : "text"}
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" variant="accent">
        {submitLabel}
      </Button>
    </form>
  );
}
