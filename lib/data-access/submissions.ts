import { readSubmissions, writeSubmissions } from "@/lib/data/submissions";
import type { Submission, SubmissionKind } from "@/lib/types";

export async function getPendingSubmissions(): Promise<Submission[]> {
  return (await readSubmissions()).filter((s) => s.status === "pending");
}

/** Newest-first — submission ids embed a timestamp (sub-<epoch>), which sorts correctly alongside the older sub-01-style seed ids. */
export async function getAllSubmissions(): Promise<Submission[]> {
  return (await readSubmissions()).slice().sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : a.submittedAt > b.submittedAt ? -1 : b.id.localeCompare(a.id)));
}

export async function getSubmissionById(id: string): Promise<Submission | undefined> {
  return (await readSubmissions()).find((s) => s.id === id);
}

/** Used by the Manage page to surface "Pending" for an entity that already has a live edit suggestion awaiting review. */
export async function getPendingEditSubmission(kind: SubmissionKind, targetId: string): Promise<Submission | undefined> {
  return (await readSubmissions()).find(
    (s) => s.kind === kind && s.mode === "edit" && s.status === "pending" && s.targetId === targetId
  );
}

export async function addSubmission(submission: Submission): Promise<void> {
  const submissions = await readSubmissions();
  submissions.push(submission);
  await writeSubmissions(submissions, `New submission: ${submission.kind} (${submission.mode})`);
}

export async function updateSubmissionStatus(id: string, status: Submission["status"]): Promise<void> {
  const submissions = await readSubmissions();
  const submission = submissions.find((s) => s.id === id);
  if (!submission) return;
  submission.status = status;
  await writeSubmissions(submissions, `Mark submission ${status}: ${id}`);
}
