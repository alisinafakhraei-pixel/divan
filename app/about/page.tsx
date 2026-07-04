import { ContactForm } from "@/components/about/contact-form";
import { MemberMiniProfile } from "@/components/community/member-mini-profile";
import { FeatureTile } from "@/components/shared/feature-tile";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTeamMembers } from "@/lib/data-access/members";

const FAQS = [
  {
    q: "How does moderation work?",
    a: "Every submission through Contribute goes to a review queue before it's published. Contributors get credit for what they add once it's approved.",
  },
  {
    q: "Is the data on Divan live?",
    a: "Stats and charts across the site are computed from the underlying People and Startups tables, not hand-maintained — they update as the directories grow.",
  },
  {
    q: "Can I edit an existing profile?",
    a: "Not yet inline — for now, use the \"Suggest an edit\" link on any profile, which routes to the Contribute page. Inline editing is planned for a future version.",
  },
  {
    q: "How do I get involved with the Divan Hackathon?",
    a: "Check the Hackathon page for the current cohort's application window, or browse past cohorts to see the format and outcomes.",
  },
];

export default function AboutPage() {
  const team = getTeamMembers();

  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-4 py-12 sm:px-6">
      <FeatureTile variant="ink">
        <SectionHeading
          as="h1"
          bold="Meet Iranian"
          muted="entrepreneurs of the world."
          subhead="Divan is a browsable, crowdsourced database of Iranian founders, startups, and the news and events around them — built to make an often-scattered community visible and connected."
        />
      </FeatureTile>

      <section className="space-y-4">
        <SectionHeading bold="Our" muted="team" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="rounded-xl border border-border p-4">
              <MemberMiniProfile member={member} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading bold="Frequently" muted="asked questions" />
        <Accordion className="max-w-2xl">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="max-w-lg space-y-4">
        <SectionHeading bold="Get in" muted="touch" />
        <ContactForm />
      </section>
    </div>
  );
}
