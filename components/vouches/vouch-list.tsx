import { Badge } from "@/components/ui/badge";
import type { Vouch } from "@/lib/types";
import { ExternalLink } from "lucide-react";

export function VouchList({ vouches }: { vouches: Vouch[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {vouches.map((vouch) => (
        <li key={vouch.id} className="flex flex-col justify-between rounded-xl border border-border p-4">
          <p className="text-sm text-foreground">&ldquo;{vouch.message}&rdquo;</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <a
              href={vouch.voucherLinkedIn}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
            >
              {vouch.voucherName}
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
            <Badge variant="secondary">{vouch.relationship}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
