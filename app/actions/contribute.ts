"use server";

import { addSubmission } from "@/lib/data-access/submissions";
import { getUploadedFile, payloadFromFormData } from "@/lib/server/form-payload";
import { saveUploadedImage } from "@/lib/server/image-store";
import type { Submission, SubmissionKind } from "@/lib/types";
import { revalidatePath } from "next/cache";

function imageFieldFor(kind: SubmissionKind): string {
  return kind === "person" ? "picture" : "logo";
}

async function buildPayload(kind: SubmissionKind, formData: FormData, storageId: string): Promise<Record<string, string>> {
  const payload = payloadFromFormData(formData);
  const file = getUploadedFile(formData, imageFieldFor(kind));
  if (file) {
    payload[imageFieldFor(kind)] = await saveUploadedImage(file, kind === "person" ? "people" : "startups", storageId);
  }
  return payload;
}

/** Public "suggest a person/startup" submission — lands in the moderation queue, visible on /admin immediately. */
export async function submitNewEntity(kind: SubmissionKind, formData: FormData): Promise<void> {
  const id = `sub-${Date.now()}`;
  const payload = await buildPayload(kind, formData, `pending-${id}`);

  const submission: Submission = {
    id,
    kind,
    mode: "new",
    payload,
    submittedBy: "anonymous",
    submittedAt: new Date().toISOString().slice(0, 10),
    status: "pending",
  };
  addSubmission(submission);
  revalidatePath("/admin");
}

/** Public "suggest an edit" submission from an entrepreneur/startup profile page. */
export async function submitEditSuggestion(kind: SubmissionKind, targetId: string, formData: FormData): Promise<void> {
  const id = `sub-${Date.now()}`;
  const payload = await buildPayload(kind, formData, `pending-${id}`);

  const submission: Submission = {
    id,
    kind,
    mode: "edit",
    targetId,
    payload,
    submittedBy: "anonymous",
    submittedAt: new Date().toISOString().slice(0, 10),
    status: "pending",
  };
  addSubmission(submission);
  revalidatePath("/admin");
}
