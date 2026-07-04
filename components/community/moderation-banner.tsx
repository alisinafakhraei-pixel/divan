import { Info } from "lucide-react";

export function ModerationBanner() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
      <Info className="size-4 shrink-0" />
      Community features shown here are UI previews using local mock data — accounts, posting, and moderation
      aren&apos;t connected to a backend yet. Anything you post resets on refresh.
    </div>
  );
}
