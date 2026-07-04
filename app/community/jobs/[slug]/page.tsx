import { JobCard } from "@/components/shared/job-card";
import { MemberMiniProfile } from "@/components/community/member-mini-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getJobBySlug, getJobs } from "@/lib/data-access/jobs";
import { getMemberById } from "@/lib/data-access/members";
import { notFound } from "next/navigation";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const poster = getMemberById(job.posterId);
  const relatedJobs = getJobs({ category: job.category }).filter((j) => j.id !== job.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-[800px] space-y-8 px-4 py-8 sm:px-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{job.title}</h1>
        <p className="text-muted-foreground">
          {job.companyName} · {job.location}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{job.type}</Badge>
          <Badge variant="secondary">{job.category}</Badge>
        </div>
        <Button variant="accent" render={<a href={job.applyLink} target="_blank" rel="noopener noreferrer" />}>
          Apply
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Description</h2>
        <p className="text-foreground">{job.description}</p>
      </div>

      {poster ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Posted by</h2>
          <MemberMiniProfile member={poster} meta={job.postedAt} />
        </div>
      ) : null}

      {relatedJobs.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Related jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedJobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
