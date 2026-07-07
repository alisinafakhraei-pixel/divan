"use client";

import { SuggestForm, type SuggestFormField } from "@/components/contribute/suggest-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface SuggestEditSheetProps {
  fields: SuggestFormField[];
  kind: "person" | "startup";
  targetId: string;
  defaultValues: Record<string, string>;
  submitLabel: string;
}

export function SuggestEditSheet({ fields, kind, targetId, defaultValues, submitLabel }: SuggestEditSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={<button type="button" className="text-sm font-medium text-action-blue hover:underline" />}
      >
        Suggest an edit
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Suggest an edit</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <SuggestForm
            fields={fields}
            kind={kind}
            mode="contribute-edit"
            targetId={targetId}
            defaultValues={defaultValues}
            submitLabel={submitLabel}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
