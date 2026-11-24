import { Sparkles } from "lucide-react";

/** Shown on profiles the Divan AI created from a news article, so readers know where it came from and can correct it. */
export function AutoAddedNote({ sourceName, sourceUrl }: { sourceName?: string; sourceUrl?: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-action-blue" />
      <span>
        Added automatically by Divan AI
        {sourceUrl ? (
          <>
            {" "}
            from{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-action-blue hover:underline">
              {sourceName ?? "the original article"}
            </a>
          </>
        ) : null}
        . Spot something wrong? Use &ldquo;Suggest an edit&rdquo;.
      </span>
    </p>
  );
}
