import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import type { NewsItem } from "@/lib/types";
import { Sparkles } from "lucide-react";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <CardShell href={`/news/${item.slug}`}>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{item.type}</Badge>
        <span className="text-xs text-muted-foreground">{item.date}</span>
      </div>
      <p className="mt-3 font-semibold text-foreground">{item.title}</p>
      <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">{item.tldr}</p>
      {item.auto ? (
        <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="size-3 shrink-0 text-action-blue" />
          <span className="truncate">{item.sourceName} · AI-curated</span>
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Submitted by {item.submittedBy}</p>
      )}
    </CardShell>
  );
}
