// Entity types mirroring the real Formaloo schema fields described in
// Divan_Website_Sitemap.md. These are the shape a future Formaloo/DB
// integration must satisfy — see lib/data-access for the swap seam.

export type Segment =
  | "Unicorn"
  | "Decacorn"
  | "Emerging Unicorn"
  | "Emerging Startups"
  | "VC"
  | "Public Company"
  | "Acquired or M&A"
  | "NGO";

export type FundingRound =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series D"
  | "Series E"
  | "Multiple Rounds"
  | "Post-IPO"
  | "Unknown";

export type ValuationTier =
  | "+$10B"
  | "+$1B"
  | "$100M-$1B"
  | "$10M-$100M"
  | "Under $10M";

export type BusinessModel = "B2B" | "B2C" | "B2B / B2C";

export type OperatingStatus = "Active" | "Public Company" | "Acquired or M&A" | "Closed";

export type CompanyType = "Startup" | "Big Company";

export type NewsType =
  | "Funding News"
  | "Article"
  | "News"
  | "Podcast"
  | "Interview"
  | "Talk/Speech"
  | "Event";

/** Moderation status for a listing: "public" is live on the site, "pending" is held back for review, "rejected" is kept on record but hidden — nothing is ever deleted by a status change. */
export type EntityStatus = "public" | "pending" | "rejected";

export interface Person {
  id: string;
  slug: string;
  name: string;
  picture: string;
  knownFor: string;
  knownForStartupId?: string;
  title: string;
  previousCompanies: string[];
  valuation?: string;
  segment: Segment;
  country: string;
  bio: string;
  additionalInfo: { label: string; url: string }[];
  featured?: boolean;
  status: EntityStatus;
  lastUpdatedAt: string;
  viewCount: number;
}

export interface Startup {
  id: string;
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  teamSize: number;
  website: string;
  fundingRound: FundingRound;
  valuation?: string;
  valuationTier: ValuationTier;
  mainCategory: string;
  industries: string[];
  businessModel: BusinessModel;
  hqCountry: string;
  hqRegion: string;
  operatingStatus: OperatingStatus;
  companyType: CompanyType;
  foundedYear: number;
  notes: string;
  founderIds: string[];
  status: EntityStatus;
  lastUpdatedAt: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  link: string;
  type: NewsType;
  tldr: string;
  sourceFavicon: string;
  submittedBy: string;
  date: string;
  relatedEntityIds: string[];
}

export interface DivanEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  city: string | "Virtual";
  rsvpLink: string;
  isPast: boolean;
  recapPhotos?: string[];
  writeup?: string;
}

export type PostType = "discussion" | "question";

export interface Reply {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  votes: number;
  isAccepted?: boolean;
}

export interface Post {
  id: string;
  postType: PostType;
  title: string;
  body: string;
  category: string;
  tags: string[];
  authorId: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  category: string;
  description: string;
  applyLink: string;
  posterId: string;
  postedAt: string;
}

export interface Perk {
  id: string;
  title: string;
  partnerName: string;
  partnerLogo: string;
  description: string;
  category: "Dev tools" | "Productivity" | "Marketing" | "Legal" | "Finance";
  claimLink: string;
  featured?: boolean;
}

export type CohortStatus = "applications-open" | "upcoming" | "closed";

export interface HackathonCohort {
  id: string;
  slug: string;
  name: string;
  theme: string;
  status: CohortStatus;
  applicationsOpenAt: string;
  applicationsCloseAt: string;
  startsAt: string;
  demoDayAt: string;
  stats: {
    applications: number;
    teams: number;
    countries: number;
    mentors: number;
    finalists: number;
  };
  mentorIds: string[];
  finalists?: string[];
  videoEmbeds?: string[];
  recapWriteup?: string;
}

export type SubmissionKind = "person" | "startup";
export type SubmissionMode = "new" | "edit";
export type SubmissionStatus = "pending" | "approved" | "declined";

export interface Submission {
  id: string;
  kind: SubmissionKind;
  mode: SubmissionMode;
  /** Only set when mode is "edit" — the Person/Startup id the suggestion proposes to change. */
  targetId?: string;
  /** Field values keyed the same way as SuggestFormField.name, so they line up with getPersonFields/getStartupFields. */
  payload: Record<string, string>;
  submittedBy: string;
  submittedAt: string;
  status: SubmissionStatus;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company?: string;
  bio?: string;
}
