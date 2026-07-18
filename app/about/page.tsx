import { SectionHeading } from "@/components/shared/section-heading";
import { SocialLinks } from "@/components/shared/social-links";
import { VolunteerCard } from "@/components/shared/volunteer-card";
import { getVolunteers } from "@/lib/data-access/volunteers";
import { Handshake, Rocket } from "lucide-react";
import Link from "next/link";

const MISSIONS = [
  {
    number: "1",
    title: "Connect",
    icon: Handshake,
    description:
      "Connect all Iranian startup founders, entrepreneurs, VCs, angel investors, ex-pats, and startup enthusiasts from all over the world to each other, so we can learn from each other's experiences.",
  },
  {
    number: "2",
    title: "Empower",
    icon: Rocket,
    description:
      "Help the next generation of entrepreneurs just starting their journey by providing access to valuable educational materials, role models, success stories, experience sharing and even failed stories.",
  },
];

export default function AboutPage() {
  const volunteers = getVolunteers().slice(0, 6);

  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-4 py-12 sm:px-6">
      <section className="max-w-3xl space-y-4">
        <SectionHeading bold="What is" muted="Divan?" />
        <p className="text-base text-muted-foreground">
          At its heart, Divan is a community for all Iranian startup founders, entrepreneurs, VCs, angel
          investors, ex-pats, and startup enthusiasts globally. It is a place where we can learn from each
          other.
        </p>
      </section>

      <section className="space-y-6">
        <SectionHeading bold="Our" muted="mission" />
        <div className="grid gap-4 sm:grid-cols-2">
          {MISSIONS.map((mission) => (
            <div key={mission.number} className="rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {mission.number}
                </span>
                <mission.icon className="size-5 text-muted-foreground" />
                <p className="font-semibold text-foreground">{mission.title}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{mission.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            bold="Our"
            muted="volunteers"
            subhead="Divan is run in large part by volunteers who give their time to keep the community, content, and events running."
          />
          <Link href="/volunteers" className="shrink-0 text-sm font-medium text-action-blue hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {volunteers.map((volunteer) => (
            <VolunteerCard key={volunteer.id} volunteer={volunteer} />
          ))}
        </div>
      </section>

      <section className="max-w-lg space-y-4">
        <SectionHeading bold="Follow" muted="us" />
        <p className="text-sm text-muted-foreground">Stay up to date with Divan across our channels.</p>
        <SocialLinks iconClassName="size-6" />
      </section>
    </div>
  );
}
