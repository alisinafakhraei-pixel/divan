"use client";

import { cn } from "@/lib/utils";
import { ArrowBigUp, Heart } from "lucide-react";
import { useState } from "react";

export function VoteControl({
  initialCount,
  variant = "like",
}: {
  initialCount: number;
  variant?: "like" | "upvote";
}) {
  const [count, setCount] = useState(initialCount);
  const [active, setActive] = useState(false);

  const Icon = variant === "like" ? Heart : ArrowBigUp;

  return (
    <button
      type="button"
      onClick={() => {
        setActive((v) => !v);
        setCount((c) => (active ? c - 1 : c + 1));
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "border-action-blue bg-accent text-accent-foreground" : "text-muted-foreground hover:border-foreground"
      )}
    >
      <Icon className={cn("size-3.5", active && "fill-current")} />
      {count}
    </button>
  );
}
