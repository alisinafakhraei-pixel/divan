import { EmptyState } from "@/components/shared/empty-state";
import { PerkCard } from "@/components/shared/perk-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { PerksToolbar } from "@/components/perks/perks-toolbar";
import { getPerkCategories, getPerks } from "@/lib/data-access/perks";
import type { Perk } from "@/lib/types";

export default async function PerksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const perks = getPerks(params.category as Perk["category"] | undefined);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Perks &"
        muted="discounts"
        subhead="Deals from Divan's partners, available to founders in the network."
      />

      <PerksToolbar categories={getPerkCategories()} />

      {perks.length === 0 ? (
        <EmptyState title="No perks found" description="Try a different category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <PerkCard key={perk.id} perk={perk} />
          ))}
        </div>
      )}
    </div>
  );
}
