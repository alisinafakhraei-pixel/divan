import { readSubmissions, writeSubmissions } from "@/lib/data/submissions";
import type { Submission } from "@/lib/types";

export async function getPendingSubmissions(): Promise<Submission[]> {
  return (await readSubmissions()).filter((s) => s.status === "pending");
}

export async function getSubmissionById(id: string): Promise<Submission | undefined> {
  return (await readSubmissions()).find((s) => s.id === id);
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
