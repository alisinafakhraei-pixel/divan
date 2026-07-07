import { SuggestForm } from "@/components/contribute/suggest-form";
import { getPersonFields, getStartupFields } from "@/components/contribute/suggest-form-fields";
import { SectionHeading } from "@/components/shared/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStartups } from "@/lib/data-access/startups";

export default async function ContributePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [companyOptions, { tab }] = await Promise.all([
    getStartups().then((startups) => startups.map((startup) => startup.name)),
    searchParams,
  ]);
  const defaultTab = tab === "startup" ? "startup" : "person";

  return (
    <div className="mx-auto max-w-[800px] space-y-10 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Contribute"
        subhead="Know someone who should be in the directory, or a story we missed? Suggest it below — every submission is reviewed before it goes live."
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="person">Suggest a person</TabsTrigger>
          <TabsTrigger value="startup">Suggest a startup</TabsTrigger>
        </TabsList>
        <TabsContent value="person" className="pt-6">
          <SuggestForm
            fields={getPersonFields(companyOptions)}
            kind="person"
            mode="contribute-new"
            submitLabel="Suggest entrepreneur"
          />
        </TabsContent>
        <TabsContent value="startup" className="pt-6">
          <SuggestForm fields={getStartupFields()} kind="startup" mode="contribute-new" submitLabel="Suggest startup" />
        </TabsContent>
      </Tabs>

      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Contribution guidelines
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
          <li>Submissions should be about Iranian founders, startups, or ecosystem news — not general tech news.</li>
          <li>Include a source or link where possible so moderators can verify details quickly.</li>
          <li>Duplicate or low-effort submissions may be merged or declined.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          How moderation works
        </h2>
        <p className="text-sm text-foreground">
          Every submission goes into a review queue before publishing — nothing appears in the directory
          automatically. Contributors get credit for what they add once it&apos;s approved.
        </p>
        <p className="text-xs text-muted-foreground">
          Not built yet: inline edit-suggestion buttons on every profile, visible edit history, and a contributor
          leaderboard — planned for a future version once this form-based flow is validated.
        </p>
      </section>
    </div>
  );
}
