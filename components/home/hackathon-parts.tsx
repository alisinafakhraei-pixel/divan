import { Button } from "@/components/ui/button";
import { formatDaysLeft, getHackathonStatus, hackathon2026 as hackathon } from "@/lib/data/hackathon-2026";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Surface = "light" | "blue" | "ink";

const PILL: Record<Surface, string> = {
  light: "bg-success text-success-foreground",
  blue: "bg-white/15 text-white ring-1 ring-white/25",
  ink: "bg-white/10 text-white ring-1 ring-white/15",
};

/** "Applications open · 4 days left" — flips to "Applications closed" after the deadline. */
export function HackathonStatusPill({ surface = "light", className }: { surface?: Surface; className?: string }) {
  const status = getHackathonStatus();
  const open = status.state === "open";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        PILL[surface],
        className
      )}
    >
      <span className="relative flex size-2">
        {open ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        ) : null}
        <span className={cn("relative inline-flex size-2 rounded-full", open ? "bg-emerald-400" : "bg-white/50")} />
      </span>
      {status.state === "open"
        ? `Applications open · ${formatDaysLeft(status.daysLeft)}`
        : "Applications closed"}
    </span>
  );
}

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Apply as an individual / as a team — or a single "View the program" link once applications close. */
export function HackathonApplyButtons({
  surface = "light",
  block = false,
  className,
}: {
  surface?: Surface;
  /** Full-width buttons stacked on mobile. */
  block?: boolean;
  className?: string;
}) {
  const status = getHackathonStatus();
  const onColor = surface !== "light";
  const layout = block ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" : "flex flex-wrap items-center gap-3";
  const width = block ? "w-full sm:w-auto" : "";

  const primary = onColor ? "bg-white text-[#1c54d3] hover:bg-white/90" : "";
  const secondary = onColor
    ? "border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
    : "";

  if (status.state === "closed") {
    return (
      <div className={cn(layout, className)}>
        <Button
          size="lg"
          variant={onColor ? "default" : "accent"}
          className={cn(primary, width)}
          render={<a href={hackathon.siteUrl} {...EXTERNAL} />}
        >
          View the program <ArrowUpRight />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(layout, className)}>
      <Button
        size="lg"
        variant={onColor ? "default" : "accent"}
        className={cn(primary, width)}
        render={<a href={hackathon.applyIndividualUrl} {...EXTERNAL} />}
      >
        Apply as an individual <ArrowUpRight />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={cn(secondary, width)}
        render={<a href={hackathon.applyTeamUrl} {...EXTERNAL} />}
      >
        Apply as a team <ArrowUpRight />
      </Button>
    </div>
  );
}
