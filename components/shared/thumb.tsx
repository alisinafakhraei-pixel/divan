import { cn } from "@/lib/utils";
import { Newspaper } from "lucide-react";

/**
 * A story's own preview image, filling its (relative) parent. Plain <img> on purpose: it points at the publisher's site,
 * and an empty alt keeps a failed load invisible, so the branded backdrop underneath shows instead.
 */
export function Thumb({ src, className }: { src?: string; className?: string }) {
  return (
    <span className="absolute inset-0 block">
      <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent to-muted text-action-blue/60">
        <Newspaper className="size-1/3 max-h-10 max-w-10" />
      </span>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className={cn("absolute inset-0 size-full object-cover", className)} />
      ) : null}
    </span>
  );
}
