import { CardShell } from "@/components/shared/card-shell";
import { Badge } from "@/components/ui/badge";
import type { NewsItem } from "@/lib/types";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <CardShell href={`/news/${item.slug}`}>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{item.type}</Badge>
        <span className="text-xs text-muted-foreground">{item.date}</span>
      </div>
      <p className="mt-3 font-semibold text-foreground">{item.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{item.tldr}</p>
      <p className="mt-3 text-xs text-muted-foreground">Submitted by {item.submittedBy}</p>
    </CardShell>
  );
}
