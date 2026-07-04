import type { HackathonCohort } from "@/lib/types";

// "Today" for this fixture set is treated as 2026-07-04 — Winter 2026's
// application window straddles that date so the dynamic promo banner
// (Home + Hackathon landing) can be exercised in the "applications open" state.
export const hackathonCohorts: HackathonCohort[] = [
  {
    id: "hk-02",
    slug: "winter-2026",
    name: "Winter 2026",
    theme: "AI-native fintech",
    status: "applications-open",
    applicationsOpenAt: "2026-06-01",
    applicationsCloseAt: "2026-07-15",
    startsAt: "2026-08-01",
    demoDayAt: "2026-08-22",
    stats: {
      applications: 190,
      teams: 0,
      countries: 0,
      mentors: 18,
      finalists: 0,
    },
    mentorIds: ["pp-01", "pp-02", "pp-17"],
  },
  {
    id: "hk-01",
    slug: "summer-2025",
    name: "Summer 2025",
    theme: "Diaspora-built climate & fintech",
    status: "closed",
    applicationsOpenAt: "2025-06-01",
    applicationsCloseAt: "2025-07-01",
    startsAt: "2025-07-15",
    demoDayAt: "2025-09-01",
    stats: {
      applications: 355,
      teams: 50,
      countries: 11,
      mentors: 27,
      finalists: 14,
    },
    mentorIds: ["pp-04", "pp-07", "pp-08", "pp-11", "pp-18"],
    finalists: [
      "Kaveh Robotics",
      "Roshan Energy",
      "Vista Commerce",
      "Atlas Biotech",
    ],
    videoEmbeds: [],
    recapWriteup:
      "Summer 2025 was Divan's most competitive cohort to date: 355 applications narrowed to 50 teams across 11 countries, mentored by 27 operators and investors from the Divan network. Demo Day closed with 14 finalists pitching to a panel that included two Divan Hackathon alumni turned founders.",
  },
];
