import { SectionHeading } from "@/components/shared/section-heading";
import { getCurrentCohort } from "@/lib/data-access/hackathon";

export default function HackathonApplyPage() {
  const cohort = getCurrentCohort();

  return (
    <div className="mx-auto max-w-[720px] space-y-6 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Apply to"
        muted={cohort?.name ?? "the next cohort"}
        subhead={cohort ? `Theme: ${cohort.theme}` : undefined}
      />
      <div className="flex min-h-80 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
        <p className="font-medium text-foreground">Application form embed goes here</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This will be the real Formaloo application form once the backend integration ships — not built in this pass.
        </p>
      </div>
    </div>
  );
}
