import { Badge } from "@/components/ui/badge";
import type { FundingRound, OperatingStatus, Segment, ValuationTier } from "@/lib/types";

export function SegmentBadge({ segment }: { segment: Segment }) {
  return <Badge variant={segment === "Unicorn" ? "unicorn" : "sky"}>{segment}</Badge>;
}

export function FundingRoundBadge({ round }: { round: FundingRound }) {
  const isSeries = round === "Series A" || round === "Series B" || round === "Series C+" || round === "Public";
  return <Badge variant={isSeries ? "success" : "warning"}>{round}</Badge>;
}

export function ValuationBadge({ tier }: { tier: ValuationTier }) {
  return <Badge variant="secondary">{tier}</Badge>;
}

export function IndustryBadge({ industry }: { industry: string }) {
  return <Badge variant="secondary">{industry}</Badge>;
}

export function OperatingStatusBadge({ status }: { status: OperatingStatus }) {
  if (status === "Active") return <Badge variant="success">Active</Badge>;
  if (status === "Acquired") return <Badge variant="sky">Acquired</Badge>;
  return <Badge variant="destructive">Shut down</Badge>;
}
