import type { DivanEvent } from "@/lib/types";

// "Today" for this fixture set is treated as 2026-07-04 (see hackathonCohorts.ts).
export const events: DivanEvent[] = [
  {
    id: "ev-01",
    slug: "divan-demo-day-winter-2026",
    title: "Divan Hackathon Demo Day — Winter 2026",
    date: "2026-08-22",
    city: "Virtual",
    rsvpLink: "https://lu.ma/example-demo-day",
    isPast: false,
  },
  {
    id: "ev-02",
    slug: "divan-berlin-mixer",
    title: "Divan Berlin Founders Mixer",
    date: "2026-08-05",
    city: "Berlin",
    rsvpLink: "https://lu.ma/example-berlin",
    isPast: false,
  },
  {
    id: "ev-03",
    slug: "divan-dubai-fintech-night",
    title: "Divan Dubai Fintech Founders Night",
    date: "2026-09-10",
    city: "Dubai",
    rsvpLink: "https://lu.ma/example-dubai",
    isPast: false,
  },
  {
    id: "ev-04",
    slug: "divan-toronto-meetup",
    title: "Divan Toronto Community Meetup",
    date: "2026-09-28",
    city: "Toronto",
    rsvpLink: "https://lu.ma/example-toronto",
    isPast: false,
  },
  {
    id: "ev-05",
    slug: "divan-london",
    title: "Divan London",
    date: "2026-05-14",
    city: "London",
    rsvpLink: "https://lu.ma/example-london",
    isPast: true,
    recapPhotos: [],
    writeup:
      "Over 200 founders, operators, and investors gathered in Shoreditch for an evening of lightning talks and networking, headlined by a fireside chat with two Divan Hackathon alumni.",
  },
  {
    id: "ev-06",
    slug: "divan-sf-mixer-2026",
    title: "Divan SF Founders Mixer",
    date: "2026-03-12",
    city: "San Francisco",
    rsvpLink: "https://lu.ma/example-sf",
    isPast: true,
    recapPhotos: [],
    writeup:
      "A packed rooftop gathering in SoMa brought together 150+ Iranian founders and operators across fintech, AI, and climate tech.",
  },
  {
    id: "ev-07",
    slug: "divan-hackathon-summer-2025-demo-day",
    title: "Divan Hackathon Demo Day — Summer 2025",
    date: "2025-09-01",
    city: "Virtual",
    rsvpLink: "https://lu.ma/example-summer-2025",
    isPast: true,
    recapPhotos: [],
    writeup:
      "50 teams from 11 countries pitched to a panel of investors and mentors, closing out the most competitive Divan Hackathon cohort to date.",
  },
  {
    id: "ev-08",
    slug: "divan-istanbul-meetup",
    title: "Divan Istanbul Community Meetup",
    date: "2025-11-20",
    city: "Istanbul",
    rsvpLink: "https://lu.ma/example-istanbul",
    isPast: true,
    recapPhotos: [],
    writeup:
      "Founders and mentors from Roshan Energy and Sepid Cloud shared lessons on building for MENA markets.",
  },
];
