import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { FundingRoundBadge, ValuationBadge } from "@/components/shared/entity-badges";
import { Badge } from "@/components/ui/badge";
import type { Startup } from "@/lib/types";

export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <CardShell href={`/startups/${startup.slug}`}>
      <EntityAvatar name={startup.name} image={startup.logo} square className="size-14 sm:size-24" />
      <div className="mt-4">
        <p className="font-semibold text-foreground">{startup.name}</p>
        <p className="text-sm text-muted-foreground">{startup.tagline}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <FundingRoundBadge round={startup.fundingRound} />
        {startup.valuation ? <ValuationBadge tier={startup.valuationTier} /> : null}
        <Badge variant="secondary">{startup.industries[0]}</Badge>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{startup.teamSize} team members</p>
    </CardShell>
  );
}
