import { DivanMark } from "@/components/shared/divan-mark";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { SectionHeading } from "@/components/shared/section-heading";
import { VouchPersonPicker } from "@/components/vouches/vouch-person-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPeople } from "@/lib/data-access/people";
import { getLeaderboards, getRecentVouches } from "@/lib/data-access/vouches";
import { cn } from "@/lib/utils";
import { ExternalLink, PenLine, Search, ShieldCheck, Trophy, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import { VOUCHES_ENABLED } from "@/lib/features";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Vouch for people | Divan",
  description: "Back the Iranian founders you believe in. A vouch is a short, public, named endorsement.",
};

const STEPS = [
  { icon: Search, title: "Find them", text: "Search for the founder, investor or builder you know." },
  { icon: PenLine, title: "Write one honest sentence", text: "Say why you'd back them, in up to 280 characters." },
  { icon: UserCheck, title: "Add your name and LinkedIn", text: "Readers can see you're a real person who knows them." },
];

const RANK_STYLES = ["bg-[#f5c542] text-[#5a4300]", "bg-[#d4d8de] text-[#3b4048]", "bg-[#e0a46c] text-[#4d2c0c]"];

function Rank({ place }: { place: number }) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        RANK_STYLES[place - 1] ?? "bg-muted text-muted-foreground"
      )}
    >
      {place}
    </span>
  );
}

function EmptyBoard({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</p>;
}

export default async function VouchPage() {
  if (!VOUCHES_ENABLED) notFound();
  const [people, boards, recent] = await Promise.all([getPeople(), getLeaderboards(10), getRecentVouches(6)]);
  const byId = new Map(people.map((p) => [p.id, p]));
  const mostVouched = boards.mostVouched.filter((row) => byId.has(row.personId));

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-12 sm:px-6 sm:py-16">
      <section className="relative isolate overflow-hidden rounded-3xl bg-[#1c54d3] px-6 py-10 text-white sm:px-12 sm:py-14">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_10%,rgba(179,224,255,0.4),transparent_45%),linear-gradient(135deg,#1c54d3_0%,#0f3590_100%)]"
        />
        <DivanMark className="pointer-events-none absolute -right-16 -bottom-20 -z-10 size-[22rem] text-white/10 sm:size-[30rem]" />
        <div className="max-w-2xl">
          <Badge className="bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/15">
            <ShieldCheck />
            {boards.total} {boards.total === 1 ? "vouch" : "vouches"} so far
          </Badge>
          <h1 className="mt-5 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl">
            Believe in someone, <span className="font-normal text-white/65">out loud.</span>
          </h1>
          <p className="mt-5 text-lg text-white/85">
            A vouch is a short, public, named endorsement. If you've worked with, invested in or learned from an Iranian
            founder, say so. It helps the next person trust them.
          </p>
        </div>
        <div className="mt-8 max-w-xl rounded-2xl bg-white p-4 text-foreground shadow-lg">
          <p className="mb-3 text-sm font-semibold">Who do you want to vouch for?</p>
          <VouchPersonPicker
            people={people.map((p) => ({
              name: p.name,
              slug: p.slug,
              title: p.title,
              knownFor: p.knownFor,
              picture: p.picture,
            }))}
          />
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading bold="How" muted="vouching works" />
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-border p-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <step.icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Step {i + 1}</p>
              <p className="mt-1 font-bold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
        <ul className="grid gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Only vouch for people you actually know. One vouch per person.</li>
          <li>Vouches are checked automatically. Spam, ads and politics don&apos;t make it through.</li>
          <li>Your name and LinkedIn are shown next to your vouch, so be honest.</li>
          <li>You can&apos;t vouch for yourself.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <SectionHeading bold="The" muted="leaderboard" subhead="Ranked by public vouches. Updated as they come in." />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              <Trophy className="size-4" /> Most vouched
            </h3>
            {mostVouched.length === 0 ? (
              <EmptyBoard text="No vouches yet. The first person to be vouched for takes the top spot." />
            ) : (
              <ol className="divide-y divide-border rounded-xl border border-border">
                {mostVouched.map((row, i) => {
                  const person = byId.get(row.personId)!;
                  return (
                    <li key={row.personId}>
                      <Link
                        href={`/entrepreneurs/${person.slug}`}
                        className="flex items-center gap-3 p-3 transition-colors hover:bg-muted"
                      >
                        <Rank place={i + 1} />
                        <EntityAvatar name={person.name} image={person.picture} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-foreground">{person.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">{person.knownFor}</span>
                        </span>
                        <Badge variant="success">
                          <ShieldCheck />
                          {row.count}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              <UserCheck className="size-4" /> Top vouchers
            </h3>
            {boards.topVouchers.length === 0 ? (
              <EmptyBoard text="No vouches yet. People who back the most founders will show up here." />
            ) : (
              <ol className="divide-y divide-border rounded-xl border border-border">
                {boards.topVouchers.map((row, i) => (
                  <li key={row.linkedIn} className="flex items-center gap-3 p-3">
                    <Rank place={i + 1} />
                    <EntityAvatar name={row.name} />
                    <a
                      href={row.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex min-w-0 flex-1 items-center gap-1 font-semibold text-foreground hover:underline"
                    >
                      <span className="truncate">{row.name}</span>
                      <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                    </a>
                    <Badge variant="secondary">
                      {row.count} {row.count === 1 ? "vouch" : "vouches"}
                    </Badge>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading bold="Latest" muted="vouches" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((vouch) => {
              const person = byId.get(vouch.personId);
              if (!person) return null;
              return (
                <li key={vouch.id} className="flex flex-col justify-between rounded-xl border border-border p-4">
                  <p className="text-sm text-foreground">&ldquo;{vouch.message}&rdquo;</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{vouch.voucherName}</span> vouched for{" "}
                    <Link href={`/entrepreneurs/${person.slug}`} className="font-semibold text-action-blue hover:underline">
                      {person.name}
                    </Link>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col items-start gap-4 rounded-xl tile-dark px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-xl font-bold">Know a founder who deserves a vouch?</p>
          <p className="mt-1 text-sm opacity-80">Find them in the directory and back them in one sentence.</p>
        </div>
        <Button variant="accent" render={<Link href="/entrepreneurs" />}>
          Browse entrepreneurs
        </Button>
      </div>
    </div>
  );
}
