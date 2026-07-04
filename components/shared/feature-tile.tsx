import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FeatureTileProps {
  variant?: "sky" | "ink" | "paper";
  children: ReactNode;
  className?: string;
}

/** Full-bleed color-block rectangle used for hero/promo modules (Apple/Google Store pattern). */
export function FeatureTile({ variant = "paper", children, className }: FeatureTileProps) {
  return (
    <div
      className={cn(
        "rounded-xl px-6 py-10 sm:px-10 sm:py-14",
        variant === "sky" && "bg-accent text-accent-foreground",
        variant === "ink" && "tile-dark",
        variant === "paper" && "border border-border bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}
