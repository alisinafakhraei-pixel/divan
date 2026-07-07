"use server";

import { addPerson, getPeople, getPersonById, updatePerson } from "@/lib/data-access/people";
import { addStartup, getStartupById, getStartups, updateStartup } from "@/lib/data-access/startups";
import { getSubmissionById, updateSubmissionStatus } from "@/lib/data-access/submissions";
import { toPersonPatch, toStartupPatch } from "@/lib/server/entity-builders";
import { getUploadedFile, payloadFromFormData } from "@/lib/server/form-payload";
import { nextSequentialId, slugify } from "@/lib/server/ids";
import { saveUploadedImage } from "@/lib/server/image-store";
import type { Person, Startup, SubmissionKind } from "@/lib/types";
import { revalidatePath } from "next/cache";

function imageFieldFor(kind: SubmissionKind): string {
  return kind === "person" ? "picture" : "logo";
}

function revalidateEntityPaths(): void {
  revalidatePath("/entrepreneurs");
  revalidatePath("/startups");
  revalidatePath("/");
  revalidatePath("/admin");
}

/** Prefers a freshly uploaded file over the fallback path already on record, so admins can replace a photo/logo before publishing without being forced to re-upload one. */
async function resolveImage(
  kind: SubmissionKind,
  formData: FormData,
  fallback: string | undefined,
  storageId: string
): Promise<string | undefined> {
  const file = getUploadedFile(formData, imageFieldFor(kind));
  if (file) return saveUploadedImage(file, kind === "person" ? "people" : "startups", storageId);
  return fallback;
}

/** Admin publishes a brand-new person/startup submission — writes straight to data/people.json or data/startups.json, no approval chain beyond this click. */
export async function adminPublishSubmission(submissionId: string, formData: FormData): Promise<void> {
  const submission = getSubmissionById(submissionId);
  if (!submission || submission.mode !== "new") return;

  const payload = payloadFromFormData(formData);

  if (submission.kind === "person") {
    const id = nextSequentialId("pp", getPeople().map((p) => p.id));
    const picture = await resolveImage("person", formData, submission.payload.picture, id);
    const person = {
      id,
      slug: slugify(payload.name),
      picture: picture ?? "",
      featured: false,
      publishStatus: "published",
      viewCount: 0,
      ...toPersonPatch(payload),
    } as Person;
    addPerson(person);
  } else {
    const id = nextSequentialId("st", getStartups().map((s) => s.id));
    const logo = await resolveImage("startup", formData, submission.payload.logo, id);
    const startup = {
      id,
      slug: slugify(payload.name),
      logo: logo ?? "",
      companyType: "Startup",
      ...toStartupPatch(payload),
    } as Startup;
    addStartup(startup);
  }

  updateSubmissionStatus(submissionId, "approved");
  revalidateEntityPaths();
}

export async function adminDeclineSubmission(submissionId: string): Promise<void> {
  updateSubmissionStatus(submissionId, "declined");
  revalidatePath("/admin");
}

/** Admin approves a suggested edit — merges the (possibly further-edited) values into the existing record. */
export async function adminApproveEdit(submissionId: string, formData: FormData): Promise<void> {
  const submission = getSubmissionById(submissionId);
  if (!submission || submission.mode !== "edit" || !submission.targetId) return;

  const payload = payloadFromFormData(formData);

  if (submission.kind === "person") {
    const target = getPersonById(submission.targetId);
    const picture = await resolveImage("person", formData, target?.picture, submission.targetId);
    updatePerson(submission.targetId, { ...toPersonPatch(payload), picture });
  } else {
    const target = getStartupById(submission.targetId);
    const logo = await resolveImage("startup", formData, target?.logo, submission.targetId);
    updateStartup(submission.targetId, { ...toStartupPatch(payload), logo });
  }

  updateSubmissionStatus(submissionId, "approved");
  revalidateEntityPaths();
}

export async function adminCancelEdit(submissionId: string): Promise<void> {
  updateSubmissionStatus(submissionId, "declined");
  revalidatePath("/admin");
}

/** Admin "Add" page — no queue, publishes straight to the JSON data files. */
export async function adminPublishDirect(kind: SubmissionKind, formData: FormData): Promise<void> {
  const payload = payloadFromFormData(formData);
  const file = getUploadedFile(formData, imageFieldFor(kind));

  if (kind === "person") {
    const id = nextSequentialId("pp", getPeople().map((p) => p.id));
    const picture = file ? await saveUploadedImage(file, "people", id) : "";
    const person = {
      id,
      slug: slugify(payload.name),
      picture,
      featured: false,
      publishStatus: "published",
      viewCount: 0,
      ...toPersonPatch(payload),
    } as Person;
    addPerson(person);
  } else {
    const id = nextSequentialId("st", getStartups().map((s) => s.id));
    const logo = file ? await saveUploadedImage(file, "startups", id) : "";
    const startup = {
      id,
      slug: slugify(payload.name),
      logo,
      companyType: "Startup",
      ...toStartupPatch(payload),
    } as Startup;
    addStartup(startup);
  }

  revalidateEntityPaths();
}
