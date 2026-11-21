import { reviewVouch } from "@/app/actions/vouch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPersonById } from "@/lib/data-access/people";
import { getPendingVouches } from "@/lib/data-access/vouches";

export default async function AdminVouchesPage() {
  const pending = await getPendingVouches();
  const rows = await Promise.all(pending.map(async (vouch) => ({ vouch, person: await getPersonById(vouch.personId) })));

  return (
    <div className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground">
        Vouches are approved automatically when they look sincere. The ones AI wasn&apos;t sure about wait here.
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to review.</p>
      ) : (
        rows.map(({ vouch, person }) => (
          <div key={vouch.id} className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warning">Pending</Badge>
              <Badge variant="secondary">{vouch.relationship}</Badge>
              <span className="text-sm font-medium text-foreground">
                {vouch.voucherName} → {person?.name ?? vouch.personId}
              </span>
            </div>
            <p className="text-sm text-foreground">&ldquo;{vouch.message}&rdquo;</p>
            {vouch.moderationNote ? <p className="text-xs text-muted-foreground">AI note: {vouch.moderationNote}</p> : null}
            <a href={vouch.voucherLinkedIn} target="_blank" rel="noopener noreferrer" className="text-xs text-action-blue hover:underline">
              {vouch.voucherLinkedIn}
            </a>
            <div className="flex gap-2">
              <form action={reviewVouch.bind(null, vouch.id, "public")}>
                <Button type="submit" size="sm" variant="accent">
                  Approve
                </Button>
              </form>
              <form action={reviewVouch.bind(null, vouch.id, "rejected")}>
                <Button type="submit" size="sm" variant="outline">
                  Reject
                </Button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
