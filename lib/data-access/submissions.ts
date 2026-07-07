import { submissions } from "@/lib/data/submissions";
import type { Submission } from "@/lib/types";

export function getPendingSubmissions(): Submission[] {
  return submissions.filter((s) => s.status === "pending");
}

export function getSubmissionById(id: string): Submission | undefined {
  return submissions.find((s) => s.id === id);
}
