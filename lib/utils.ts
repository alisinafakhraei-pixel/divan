import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parses fixture valuation strings like "$12.4B" or "$920M (acquisition)" into millions of USD. */
export function parseValuationToMillions(valuation?: string): number {
  if (!valuation) return 0;
  const match = valuation.match(/\$([\d.]+)\s*(B|M)/i);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return unit === "B" ? amount * 1000 : amount;
}

export function formatMillionsAsValuation(millions: number): string {
  if (millions >= 1_000_000) return `$${(millions / 1_000_000).toFixed(1)}T`;
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  return `$${millions.toFixed(0)}M`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
