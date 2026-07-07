"use client";

import { Combobox } from "@/components/contribute/combobox";
import type { SuggestFormField } from "@/components/contribute/suggest-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function FileFieldInput({ field }: { field: SuggestFormField }) {
  const [error, setError] = useState<string | null>(null);
  const maxBytes = field.maxSizeBytes ?? 1_000_000;

  return (
    <div className="space-y-1">
      <Input
        id={field.name}
        name={field.name}
        type="file"
        accept="image/*"
        required={field.required}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) {
            setError(null);
            return;
          }
          if (file.size > maxBytes) {
            setError(`File is too large — max ${(maxBytes / 1_000_000).toFixed(1)}MB.`);
            e.target.value = "";
            return;
          }
          setError(null);
        }}
      />
      <p className={error ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {error ?? field.helpText ?? `Image, up to ${(maxBytes / 1_000_000).toFixed(1)}MB.`}
      </p>
    </div>
  );
}

/** Renders a single contribute/admin field. Shared by the contributor form and the admin review screens so both stay in sync with the schema. */
export function FormFieldInput({ field, defaultValue }: { field: SuggestFormField; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      {field.label ? <Label htmlFor={field.name}>{field.label}</Label> : null}
      {field.type === "textarea" ? (
        <Textarea id={field.name} name={field.name} rows={3} required={field.required} defaultValue={defaultValue} />
      ) : field.type === "select" ? (
        <Select name={field.name} required={field.required} defaultValue={defaultValue}>
          <SelectTrigger id={field.name} className="w-full">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === "combobox" ? (
        <Combobox
          id={field.name}
          name={field.name}
          options={field.options ?? []}
          allowCreate={field.allowCreate}
          required={field.required}
          defaultValue={defaultValue}
        />
      ) : field.type === "file" ? (
        <FileFieldInput field={field} />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          type={field.type === "url" ? "url" : "text"}
          required={field.required}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}
