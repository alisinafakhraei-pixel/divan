import { SuggestForm, type SuggestFormField } from "@/components/contribute/suggest-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PERSON_FIELDS: SuggestFormField[] = [
  { name: "name", label: "Name", required: true },
  { name: "knownFor", label: "Known for (company)", required: true },
  { name: "title", label: "Title / role", required: true },
  { name: "country", label: "Country", required: true },
  { name: "linkedin", label: "LinkedIn or other link", type: "url" },
  { name: "notes", label: "Anything else we should know?", type: "textarea" },
];

const STARTUP_FIELDS: SuggestFormField[] = [
  { name: "name", label: "Startup name", required: true },
  { name: "tagline", label: "Tagline", required: true },
  { name: "website", label: "Website", type: "url", required: true },
  { name: "hqCountry", label: "HQ country", required: true },
  { name: "founders", label: "Founder name(s)", required: true },
  { name: "notes", label: "Description", type: "textarea" },
];

const NEWS_FIELDS: SuggestFormField[] = [
  { name: "title", label: "Headline", required: true },
  { name: "link", label: "Link", type: "url", required: true },
  { name: "tldr", label: "TL;DR", type: "textarea", required: true },
];

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-10 px-4 py-12 sm:px-6">
      <SectionHeading
        as="h1"
        bold="Add or"
        muted="update"
        subhead="Know someone who should be in the directory, or a story we missed? Suggest it below — every submission is reviewed before it goes live."
      />

      <Tabs defaultValue="person">
        <TabsList>
          <TabsTrigger value="person">Suggest a person</TabsTrigger>
          <TabsTrigger value="startup">Suggest a startup</TabsTrigger>
          <TabsTrigger value="news">Submit news</TabsTrigger>
        </TabsList>
        <TabsContent value="person" className="pt-6">
          <SuggestForm fields={PERSON_FIELDS} submitLabel="Suggest entrepreneur" />
        </TabsContent>
        <TabsContent value="startup" className="pt-6">
          <SuggestForm fields={STARTUP_FIELDS} submitLabel="Suggest startup" />
        </TabsContent>
        <TabsContent value="news" className="pt-6">
          <SuggestForm fields={NEWS_FIELDS} submitLabel="Submit news" />
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
