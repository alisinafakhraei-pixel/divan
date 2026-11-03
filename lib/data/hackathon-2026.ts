// Facts for the live Divan Hackathon (https://hackathon.divan.ac/) — the registration site is the source of truth.
// Update the dates/prizes here and every homepage promo follows.
const SITE = "https://hackathon.divan.ac";
const EVENT_ID = "090bba39-2827-4428-80b4-687dacb667cc";

export const hackathon2026 = {
  name: "Divan Hackathon 2026",
  tagline: "Ideas become possible together.",
  description: "A three-week online hackathon to develop ideas, build projects, and present them at Demo Day.",
  siteUrl: `${SITE}/`,
  applyIndividualUrl: `${SITE}/apply/?kind=individual&event=${EVENT_ID}`,
  applyTeamUrl: `${SITE}/apply/?kind=team_lead&event=${EVENT_ID}`,
  audiences: ["Founders", "Developers", "Designers", "Domain experts"],
  startsOn: "November 21, 2026",
  startsShort: "Nov 21",
  /** Toronto time (EST in November). */
  applicationDeadline: "2026-11-07T23:59:00-05:00",
  deadlineDate: "2026-11-07",
  deadlineShort: "Nov 7",
  deadlineTimeZone: "America/Toronto",
  prizePool: "$2,000",
  currency: "CAD",
  prizes: [
    { place: "1st", amount: "$1,000" },
    { place: "2nd", amount: "$600" },
    { place: "3rd", amount: "$400" },
  ],
  weeks: [
    {
      label: "Week 1",
      title: "Fire Drill",
      short: "Define the problem, solution and team.",
    },
    {
      label: "Week 2",
      title: "Sprint",
      short: "Build and test a prototype or MVP.",
    },
    {
      label: "Week 3",
      title: "Final Demo Day Week",
      short: "Refine with mentors, then present at Demo Day.",
    },
  ],
};

export type HackathonStatus = { state: "open"; daysLeft: number } | { state: "closed" };

/** Calendar days until the deadline in Toronto time (0 = last day); "closed" once the deadline instant has passed. */
export function getHackathonStatus(now = new Date()): HackathonStatus {
  if (now.getTime() > new Date(hackathon2026.applicationDeadline).getTime()) return { state: "closed" };

  const todayInToronto = new Intl.DateTimeFormat("en-CA", { timeZone: hackathon2026.deadlineTimeZone }).format(now);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.round(
    (Date.parse(`${hackathon2026.deadlineDate}T00:00:00Z`) - Date.parse(`${todayInToronto}T00:00:00Z`)) / msPerDay
  );
  return { state: "open", daysLeft: Math.max(0, daysLeft) };
}

export function formatDaysLeft(daysLeft: number): string {
  if (daysLeft === 0) return "Last day to apply";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}
