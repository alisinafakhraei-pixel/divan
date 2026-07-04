import { EntityAvatar } from "@/components/shared/entity-avatar";
import { FundingRoundBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Startup } from "@/lib/types";
import Link from "next/link";

export function StartupTableRow({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-border px-2 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/50"
    >
      <EntityAvatar name={startup.name} image={startup.logo} size="sm" square />
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{startup.name}</p>
        <p className="truncate text-xs text-muted-foreground">{startup.tagline}</p>
      </div>
      <span className="hidden text-muted-foreground sm:inline">{startup.valuation ?? "—"}</span>
      <FundingRoundBadge round={startup.fundingRound} />
      <Badge variant="secondary">{startup.hqCountry}</Badge>
    </Link>
  );
}
