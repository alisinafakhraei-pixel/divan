import { perks } from "@/lib/data/perks";
import type { Perk } from "@/lib/types";

export function getPerks(category?: Perk["category"]): Perk[] {
  const result = category ? perks.filter((p) => p.category === category) : [...perks];
  return result.sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function getPerkCategories(): Perk["category"][] {
  return Array.from(new Set(perks.map((p) => p.category)));
}
