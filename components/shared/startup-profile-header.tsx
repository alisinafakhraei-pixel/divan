import { EntityAvatar } from "@/components/shared/entity-avatar";
import { FundingRoundBadge, OperatingStatusBadge, ValuationBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Startup } from "@/lib/types";

export function StartupProfileHeader({ startup }: { startup: Startup }) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <EntityAvatar name={startup.name} image={startup.logo} size="lg" square className="size-20" />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {startup.name}
        </h1>
        <p className="mt-1 text-muted-foreground">{startup.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FundingRoundBadge round={startup.fundingRound} />
          {startup.valuation ? <ValuationBadge tier={startup.valuationTier} /> : null}
          <Badge variant="secondary">{startup.businessModel}</Badge>
          <OperatingStatusBadge status={startup.operatingStatus} />
        </div>
      </div>
    </div>
  );
}
