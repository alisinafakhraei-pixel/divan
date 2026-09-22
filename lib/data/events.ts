import type { DivanEvent } from "@/lib/types";

// Shared pool of event-vibe photos (Unsplash) — mixed into each event's gallery for variety.
const CONFERENCE_AUDIENCE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=70";
const CONFERENCE_ROOM = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=70";
const CONFETTI_CROWD = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=70";
const ROOFTOP_LIGHTS = "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=70";
const STARTUP_ALLHANDS = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=70";
const COFFEE_NETWORKING = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=70";
const HACKATHON_PAIRING = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=70";

// The confirmed 2026 event calendar — see the events-page unveil thread.
export const events: DivanEvent[] = [
  {
    id: "ev-01",
    slug: "divan-stockholm",
    title: "Divan Stockholm",
    date: "2026-09-10",
    city: "Stockholm",
    country: "Sweden",
    isPast: false,
    description:
      "An evening of lightning talks and open-bar networking on the water — Divan's first stop in the Nordics, for founders, operators, and investors building out of Sweden and beyond.",
    images: [
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1600&q=70",
      CONFERENCE_AUDIENCE,
      COFFEE_NETWORKING,
      ROOFTOP_LIGHTS,
    ],
  },
  {
    id: "ev-02",
    slug: "divan-toronto",
    title: "Divan Toronto",
    date: "2026-09-17",
    city: "Toronto",
    country: "Canada",
    isPast: false,
    description:
      "A founders mixer bringing together Toronto's growing Iranian startup scene — demos, short pitches, and time to actually talk to the person next to you.",
    images: [
      "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1600&q=70",
      STARTUP_ALLHANDS,
      CONFETTI_CROWD,
      COFFEE_NETWORKING,
    ],
  },
  {
    id: "ev-03",
    slug: "divan-london",
    title: "Divan London",
    date: "2026-10-29",
    city: "London",
    country: "United Kingdom",
    isPast: false,
    description:
      "Divan's flagship UK gathering — a night of talks, demos, and networking for the London founder and investor community, with a fireside chat closing out the evening.",
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=70",
      CONFERENCE_ROOM,
      ROOFTOP_LIGHTS,
      CONFERENCE_AUDIENCE,
    ],
  },
  {
    id: "ev-04",
    slug: "divan-hackathon-2026",
    title: "Divan Hackathon 2026",
    date: "2026-11-01",
    dateLabel: "November 2026",
    city: "Virtual",
    isPast: false,
    description:
      "A weekend of building, mentorship, and demos — teams from around the world ship a working prototype and pitch to a panel of investors and operators. Fully remote, open to all.",
    images: [HACKATHON_PAIRING, CONFETTI_CROWD, STARTUP_ALLHANDS, CONFERENCE_ROOM],
  },
  {
    id: "ev-05",
    slug: "divan-sf",
    title: "Divan SF",
    date: "2026-12-01",
    dateLabel: "TBA",
    city: "San Francisco",
    country: "United States",
    isPast: false,
    description:
      "Divan returns to the Bay Area — details and date still being locked in, but expect the usual mix of demos, mentors, and a rooftop after-party.",
    images: [
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1600&q=70",
      COFFEE_NETWORKING,
      CONFERENCE_AUDIENCE,
      ROOFTOP_LIGHTS,
    ],
  },
  {
    id: "ev-06",
    slug: "divan-sydney",
    title: "Divan Sydney",
    date: "2026-12-02",
    dateLabel: "TBA",
    city: "Sydney",
    country: "Australia",
    isPast: false,
    description: "Divan's first Australia meetup — venue and date coming soon.",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=70",
      STARTUP_ALLHANDS,
      CONFETTI_CROWD,
      COFFEE_NETWORKING,
    ],
  },
  {
    id: "ev-07",
    slug: "divan-paris",
    title: "Divan Paris",
    date: "2026-12-03",
    dateLabel: "TBA",
    city: "Paris",
    country: "France",
    isPast: false,
    description: "A Divan evening in Paris for the French and wider European community — venue and date coming soon.",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=70",
      ROOFTOP_LIGHTS,
      CONFERENCE_ROOM,
      CONFERENCE_AUDIENCE,
    ],
  },
];
