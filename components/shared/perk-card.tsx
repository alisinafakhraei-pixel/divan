import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Perk } from "@/lib/types";

export function PerkCard({ perk }: { perk: Perk }) {
  return (
    <CardShell className={perk.featured ? "border-action-blue/40 bg-accent/30" : undefined}>
      <div className="flex items-start justify-between gap-3">
        <EntityAvatar name={perk.partnerName} image={perk.partnerLogo} square />
        <Badge variant="secondary">{perk.category}</Badge>
      </div>
      <p className="mt-3 font-semibold text-foreground">{perk.title}</p>
      <p className="text-sm text-muted-foreground">{perk.partnerName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{perk.description}</p>
      <Button
        size="sm"
        variant={perk.featured ? "accent" : "outline"}
        className="mt-4"
        render={<a href={perk.claimLink} target="_blank" rel="noopener noreferrer" />}
      >
        Claim
      </Button>
    </CardShell>
  );
}
