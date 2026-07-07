import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTABanner } from "@/components/shared/cta-banner";
import { DiscussionCard } from "@/components/shared/discussion-card";
import { EmptyState } from "@/components/shared/empty-state";
import { EventCard } from "@/components/shared/event-card";
import { FeatureTile } from "@/components/shared/feature-tile";
import { JobCard } from "@/components/shared/job-card";
import { MentorCard } from "@/components/shared/mentor-card";
import { NewsCard } from "@/components/shared/news-card";
import { PerkCard } from "@/components/shared/perk-card";
import { PersonCard } from "@/components/shared/person-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StartupCard } from "@/components/shared/startup-card";
import { StatsBar } from "@/components/shared/stats-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSiteStats } from "@/lib/data-access/stats";
import { getPosts } from "@/lib/data-access/discussions";
import { getEventBySlug, getUpcomingEvents } from "@/lib/data-access/events";
import { getJobs } from "@/lib/data-access/jobs";
import { getLatestNews } from "@/lib/data-access/news";
import { getPeople } from "@/lib/data-access/people";
import { getPerks } from "@/lib/data-access/perks";
import { getStartups } from "@/lib/data-access/startups";
import { InteractiveDemo } from "@/app/style-guide/interactive-demo";
import type { ReactNode } from "react";

const swatches: { name: string; className: string }[] = [
  { name: "Ink", className: "bg-foreground text-background" },
  { name: "Paper", className: "border border-border bg-background text-foreground" },
  { name: "Action Blue", className: "bg-action-blue text-white" },
  { name: "Sky", className: "bg-accent text-accent-foreground" },
  { name: "Unicorn", className: "bg-unicorn text-unicorn-foreground" },
  { name: "Neutral 100", className: "bg-secondary text-secondary-foreground" },
  { name: "Neutral 300", className: "border border-border bg-background text-foreground" },
  { name: "Success", className: "bg-success text-success-foreground" },
  { name: "Warning", className: "bg-warning text-warning-foreground" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-border py-10 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function StyleGuidePage() {
  const [stats, people, startup] = await Promise.all([getSiteStats(), getPeople(), getStartups().then((s) => s[0])]);
  const person = people[0];
  const discussion = getPosts("discussion")[0];
  const question = getPosts("question")[0];
  const upcomingEvent = getUpcomingEvents(1)[0];
  const pastEvent = getEventBySlug("divan-london");
  const job = getJobs()[0];
  const newsItem = getLatestNews(1)[0];
  const featuredPerk = getPerks().find((p) => p.featured)!;
  const normalPerk = getPerks().find((p) => !p.featured)!;
  const mentor = people[3];

  return (
    <div className="mx-auto max-w-[1200px] space-y-2 px-4 py-12 sm:px-6">
      <SectionHeading as="h1" bold="Divan" muted="style guide" subhead="Not in nav — visual sanity check for Phase 0." />

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className={`rounded-xl p-4 text-sm font-medium ${s.className}`}>
              {s.name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-4">
          <SectionHeading as="h1" bold="Meet Iranian" muted="entrepreneurs" />
          <SectionHeading as="h2" bold="Featured" muted="startups" />
          <p className="text-base text-foreground">Body text — 16px/400, used for descriptions and prose.</p>
          <p className="text-xs font-medium text-muted-foreground uppercase">Caption — 12px/500</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="link">Ghost / link</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="unicorn">Unicorn</Badge>
          <Badge variant="sky">VC</Badge>
          <Badge variant="warning">Seed</Badge>
          <Badge variant="success">Series A+</Badge>
          <Badge variant="secondary">Fintech</Badge>
          <Badge variant="destructive">Shut down</Badge>
        </div>
      </Section>

      <Section title="Feature tiles">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureTile variant="sky">
            <p className="font-bold">Sky tile</p>
            <p className="mt-1 text-sm opacity-80">Ambient brand tint</p>
          </FeatureTile>
          <FeatureTile variant="ink">
            <p className="font-bold">Ink tile</p>
            <p className="mt-1 text-sm opacity-80">Occasional full-bleed feature</p>
          </FeatureTile>
          <FeatureTile variant="paper">
            <p className="font-bold">Paper tile</p>
            <p className="mt-1 text-sm text-muted-foreground">Bordered, no fill</p>
          </FeatureTile>
        </div>
      </Section>

      <Section title="CTA banner">
        <div className="space-y-4">
          <CTABanner
            heading="Know someone who should be here?"
            description="Suggest an entrepreneur or startup for the Divan directory."
            ctaLabel="Contribute"
            ctaHref="/contribute"
            variant="ink"
          />
          <CTABanner
            heading="Applications open for Winter 2026"
            description="Apply to the next Divan Hackathon cohort."
            ctaLabel="Apply now"
            ctaHref="/hackathon/apply"
            variant="sky"
          />
        </div>
      </Section>

      <Section title="Stats bar">
        <StatsBar
          stats={[
            { label: "Entrepreneurs", value: stats.totalEntrepreneurs },
            { label: "Startups", value: stats.totalStartups },
            { label: "Countries", value: stats.countriesRepresented },
            { label: "Tracked valuation", value: stats.combinedTrackedValuation },
          ]}
        />
      </Section>

      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PersonCard person={person} />
          <StartupCard startup={startup} />
          <NewsCard item={newsItem} />
          {upcomingEvent ? <EventCard event={upcomingEvent} /> : null}
          {pastEvent ? <EventCard event={pastEvent} /> : null}
          <JobCard job={job} />
          <DiscussionCard post={discussion} />
          <DiscussionCard post={question} />
          <PerkCard perk={featuredPerk} />
          <PerkCard perk={normalPerk} />
          <MentorCard mentor={mentor} />
        </div>
      </Section>

      <Section title="Filter toolbar, grid/table toggle, pagination (interactive)">
        <InteractiveDemo />
      </Section>

      <Section title="Empty state">
        <EmptyState
          title="No results found"
          description="Try adjusting your filters or search terms."
          action={<Button variant="outline">Clear filters</Button>}
        />
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="map">
          <TabsList>
            <TabsTrigger value="map">World map</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="pt-3 text-sm text-muted-foreground">
            World map view (built in Phase 5).
          </TabsContent>
          <TabsContent value="industries" className="pt-3 text-sm text-muted-foreground">
            Industries breakdown (built in Phase 5).
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <Accordion className="max-w-lg">
          <AccordionItem value="q1">
            <AccordionTrigger>How does moderation work?</AccordionTrigger>
            <AccordionContent>
              Submissions go through a review queue before publishing. Details in Phase 11.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Is this data live?</AccordionTrigger>
            <AccordionContent>
              Not yet — this build runs on local mock data until a backend is connected.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
