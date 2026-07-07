import { readSubmissions, writeSubmissions } from "@/lib/data/submissions";
import type { Submission } from "@/lib/types";

export function getPendingSubmissions(): Submission[] {
  return readSubmissions().filter((s) => s.status === "pending");
}

export function getSubmissionById(id: string): Submission | undefined {
  return readSubmissions().find((s) => s.id === id);
}

export function addSubmission(submission: Submission): void {
  const submissions = readSubmissions();
  submissions.push(submission);
  writeSubmissions(submissions);
}

export function updateSubmissionStatus(id: string, status: Submission["status"]): void {
  const submissions = readSubmissions();
  const submission = submissions.find((s) => s.id === id);
  if (!submission) return;
  submission.status = status;
  writeSubmissions(submissions);
}
