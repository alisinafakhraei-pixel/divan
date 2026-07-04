import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  bold: string;
  muted?: string;
  subhead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

/**
 * The site's signature mixed-weight headline: a heavy-weight bold phrase
 * followed by a regular muted-gray phrase in the same line, e.g.
 * "Meet Iranian" (bold) + "entrepreneurs" (muted).
 */
export function SectionHeading({
  bold,
  muted,
  subhead,
  align = "left",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Tag
        className={cn(
          "font-sans font-extrabold tracking-tight text-foreground",
          as === "h1" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
        )}
      >
        {bold} {muted ? <span className="font-normal text-muted-foreground">{muted}</span> : null}
      </Tag>
      {subhead ? <p className="mt-3 text-base text-muted-foreground">{subhead}</p> : null}
    </div>
  );
}
