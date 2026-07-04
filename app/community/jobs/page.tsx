"use client";

import { PostJobForm } from "@/components/community/post-job-form";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterToolbar } from "@/components/shared/filter-toolbar";
import { JobCard } from "@/components/shared/job-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getJobs } from "@/lib/data-access/jobs";
import { useMockAuth } from "@/lib/mock-auth";
import type { Job } from "@/lib/types";
import { useMemo, useState } from "react";

export default function JobsPage() {
  const { currentMemberId } = useMockAuth();
  const [extraJobs, setExtraJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");

  const jobs = useMemo(() => {
    const all = [...extraJobs, ...getJobs()];
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((j) => j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q));
  }, [extraJobs, search]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
      <SectionHeading as="h1" bold="Job" muted="market" />

      <PostJobForm
        onSubmit={(job) =>
          setExtraJobs((prev) => [
            {
              ...job,
              id: `local-${Date.now()}`,
              slug: `local-${Date.now()}`,
              companyLogo: "",
              type: "Full-time",
              category: "General",
              applyLink: job.applyLink || "#",
              posterId: currentMemberId,
              postedAt: new Date().toISOString().slice(0, 10),
            },
            ...prev,
          ])
        }
      />

      <FilterToolbar
        searchPlaceholder="Search jobs by title or company..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {jobs.length === 0 ? (
        <EmptyState title="No jobs found" description="Try a different search, or post the first one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
