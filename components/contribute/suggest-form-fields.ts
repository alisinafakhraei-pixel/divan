import type { SuggestFormField } from "@/components/contribute/suggest-form";
import { COUNTRIES } from "@/lib/countries";
import type { Person, Startup } from "@/lib/types";

const SEGMENT_OPTIONS = [
  "Unicorn",
  "Decacorn",
  "Emerging Unicorn",
  "Emerging Startups",
  "VC",
  "Public Company",
  "Acquired or M&A",
  "NGO",
];

const FUNDING_ROUND_OPTIONS = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series D",
  "Series E",
  "Multiple Rounds",
  "Post-IPO",
  "Unknown",
];

const BUSINESS_MODEL_OPTIONS = ["B2B", "B2C", "B2B / B2C"];

const OPERATING_STATUS_OPTIONS = ["Active", "Public Company", "Acquired or M&A", "Closed"];

const LOGO_MAX_BYTES = 1_000_000;

export function getPersonFields(companyOptions: string[]): SuggestFormField[] {
  return [
    { name: "name", label: "Name", required: true },
    { name: "picture", label: "Photo", type: "file", maxSizeBytes: LOGO_MAX_BYTES },
    { name: "title", label: "Title / role", required: true },
    {
      name: "knownFor",
      label: "Known for (company)",
      type: "combobox",
      options: companyOptions,
      allowCreate: true,
      required: true,
    },
    { name: "segment", label: "Segment", type: "select", options: SEGMENT_OPTIONS, required: true },
    { name: "country", label: "Country", type: "combobox", options: COUNTRIES, required: true },
    { name: "bio", label: "Bio", type: "textarea", required: true },
    { name: "previousCompanies", label: "Previous companies (comma-separated)" },
    { name: "valuation", label: "Valuation" },
    { name: "linkedin", label: "LinkedIn or other link", type: "url" },
  ];
}

export function getStartupFields(): SuggestFormField[] {
  return [
    { name: "name", label: "Startup name", required: true },
    { name: "logo", label: "Logo", type: "file", maxSizeBytes: LOGO_MAX_BYTES },
    { name: "tagline", label: "Tagline", required: true },
    { name: "website", label: "Website", type: "url", required: true },
    { name: "fundingRound", label: "Funding round", type: "select", options: FUNDING_ROUND_OPTIONS, required: true },
    { name: "valuation", label: "Valuation" },
    { name: "businessModel", label: "Business model", type: "select", options: BUSINESS_MODEL_OPTIONS, required: true },
    {
      name: "operatingStatus",
      label: "Operating status",
      type: "select",
      options: OPERATING_STATUS_OPTIONS,
      required: true,
    },
    { name: "hqCountry", label: "HQ country", type: "combobox", options: COUNTRIES, required: true },
    { name: "hqRegion", label: "HQ region" },
    { name: "industries", label: "Industries (comma-separated)", required: true },
    { name: "mainCategory", label: "Main category", required: true },
    { name: "teamSize", label: "Team size" },
    { name: "foundedYear", label: "Founded year" },
    { name: "founders", label: "Founder name(s)", required: true },
    { name: "notes", label: "Description", type: "textarea", required: true },
  ];
}

/** Maps a Person onto the same field names `getPersonFields` renders, for prefilling edit forms and computing admin diffs. */
export function personToFieldValues(person: Person): Record<string, string> {
  return {
    name: person.name,
    title: person.title,
    knownFor: person.knownFor,
    segment: person.segment,
    country: person.country,
    bio: person.bio,
    previousCompanies: person.previousCompanies.join(", "),
    valuation: person.valuation ?? "",
    linkedin: person.additionalInfo[0]?.url ?? "",
  };
}

/** Maps a Startup onto the same field names `getStartupFields` renders, for prefilling edit forms and computing admin diffs. */
export function startupToFieldValues(startup: Startup, founderNames: string[]): Record<string, string> {
  return {
    name: startup.name,
    tagline: startup.tagline,
    website: startup.website,
    fundingRound: startup.fundingRound,
    valuation: startup.valuation ?? "",
    businessModel: startup.businessModel,
    operatingStatus: startup.operatingStatus,
    hqCountry: startup.hqCountry,
    hqRegion: startup.hqRegion,
    industries: startup.industries.join(", "),
    mainCategory: startup.mainCategory,
    teamSize: String(startup.teamSize),
    foundedYear: String(startup.foundedYear),
    founders: founderNames.join(", "),
    notes: startup.notes,
  };
}
