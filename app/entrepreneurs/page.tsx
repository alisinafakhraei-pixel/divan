import { EntrepreneursToolbar } from "@/components/entrepreneurs/entrepreneurs-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PersonCard } from "@/components/shared/person-card";
import { PersonTableRow } from "@/components/shared/person-table-row";
import { SectionHeading } from "@/components/shared/section-heading";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import {
  getPeople,
  getPeopleCountries,
  getPeopleIndustries,
  getPeopleSegments,
  type PeopleSort,
} from "@/lib/data-access/people";
import type { Segment } from "@/lib/types";
import Link from "next/link";

const PAGE_SIZE = 9;

export default async function EntrepreneursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const view = params.view === "table" ? "table" : "grid";

  const [people, countries, segments, industries] = await Promise.all([
    getPeople(
      {
        search: params.q,
        country: params.country,
        segment: params.segment as Segment | undefined,
        industry: params.industry,
      },
      (params.sort as PeopleSort) ?? "name-asc"
    ),
    getPeopleCountries(),
    getPeopleSegments(),
    getPeopleIndustries(),
  ]);

  const pageCount = Math.max(1, Math.ceil(people.length / PAGE_SIZE));
  const pageItems = people.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading
          as="h1"
          bold="Persian"
          muted="entrepreneurs"
          subhead="A browsable directory of Iranian founders, operators, and investors around the world."
        />
        <Button variant="outline" render={<Link href="/contribute" />} className="shrink-0">
          Suggest an entrepreneur
        </Button>
      </div>

      <EntrepreneursToolbar countries={countries} segments={segments} industries={industries} />

      {pageItems.length === 0 ? (
        <EmptyState
          title="No entrepreneurs found"
          description="Try adjusting your filters or search terms."
        />
      ) : view === "table" ? (
        <div className="rounded-xl border border-border">
          {pageItems.map((person) => (
            <PersonTableRow key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="stagger-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}

      <UrlPagination pageCount={pageCount} />
    </div>
  );
}
