"use server";

import { addPerson, deletePerson, getPeople, getPersonById, updatePerson } from "@/lib/data-access/people";
import { addStartup, deleteStartup, getStartupById, getStartups, updateStartup } from "@/lib/data-access/startups";
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

/** When a new person names an existing startup as "known for", add them to that startup's founder list too — the link should show up on both sides. */
async function linkPersonToKnownForStartup(person: Person): Promise<void> {
  if (!person.knownForStartupId) return;
  const startup = await getStartupById(person.knownForStartupId);
  if (!startup || startup.founderIds.includes(person.id)) return;
  await updateStartup(startup.id, { founderIds: [...startup.founderIds, person.id] });
}

/** Admin publishes a brand-new person/startup submission — writes straight to data/people.json or data/startups.json, no approval chain beyond this click. */
export async function adminPublishSubmission(submissionId: string, formData: FormData): Promise<void> {
  const submission = await getSubmissionById(submissionId);
  if (!submission || submission.mode !== "new") return;

  const payload = payloadFromFormData(formData);

  if (submission.kind === "person") {
    const id = nextSequentialId("pp", (await getPeople()).map((p) => p.id));
    const picture = await resolveImage("person", formData, submission.payload.picture, id);
    const person = {
      id,
      slug: slugify(payload.name),
      picture: picture ?? "",
      featured: false,
      publishStatus: "published",
      viewCount: 0,
      ...(await toPersonPatch(payload)),
    } as Person;
    await addPerson(person);
    await linkPersonToKnownForStartup(person);
  } else {
    const id = nextSequentialId("st", (await getStartups()).map((s) => s.id));
    const logo = await resolveImage("startup", formData, submission.payload.logo, id);
    const startup = {
      id,
      slug: slugify(payload.name),
      logo: logo ?? "",
      companyType: "Startup",
      ...(await toStartupPatch(payload)),
    } as Startup;
    await addStartup(startup);
  }

  await updateSubmissionStatus(submissionId, "approved");
  revalidateEntityPaths();
}

export async function adminDeclineSubmission(submissionId: string): Promise<void> {
  await updateSubmissionStatus(submissionId, "declined");
  revalidatePath("/admin");
}

/** Admin approves a suggested edit — merges the (possibly further-edited) values into the existing record. */
export async function adminApproveEdit(submissionId: string, formData: FormData): Promise<void> {
  const submission = await getSubmissionById(submissionId);
  if (!submission || submission.mode !== "edit" || !submission.targetId) return;

  const payload = payloadFromFormData(formData);

  if (submission.kind === "person") {
    const target = await getPersonById(submission.targetId);
    const picture = await resolveImage("person", formData, target?.picture, submission.targetId);
    await updatePerson(submission.targetId, { ...(await toPersonPatch(payload)), picture });
  } else {
    const target = await getStartupById(submission.targetId);
    const logo = await resolveImage("startup", formData, target?.logo, submission.targetId);
    await updateStartup(submission.targetId, { ...(await toStartupPatch(payload)), logo });
  }

  await updateSubmissionStatus(submissionId, "approved");
  revalidateEntityPaths();
}

export async function adminCancelEdit(submissionId: string): Promise<void> {
  await updateSubmissionStatus(submissionId, "declined");
  revalidatePath("/admin");
}

/** Admin "Add" page — no queue, publishes straight to the JSON data files. */
export async function adminPublishDirect(kind: SubmissionKind, formData: FormData): Promise<void> {
  const payload = payloadFromFormData(formData);
  const file = getUploadedFile(formData, imageFieldFor(kind));

  if (kind === "person") {
    const id = nextSequentialId("pp", (await getPeople()).map((p) => p.id));
    const picture = file ? await saveUploadedImage(file, "people", id) : "";
    const person = {
      id,
      slug: slugify(payload.name),
      picture,
      featured: false,
      publishStatus: "published",
      viewCount: 0,
      ...(await toPersonPatch(payload)),
    } as Person;
    await addPerson(person);
    await linkPersonToKnownForStartup(person);
  } else {
    const id = nextSequentialId("st", (await getStartups()).map((s) => s.id));
    const logo = file ? await saveUploadedImage(file, "startups", id) : "";
    const startup = {
      id,
      slug: slugify(payload.name),
      logo,
      companyType: "Startup",
      ...(await toStartupPatch(payload)),
    } as Startup;
    await addStartup(startup);
  }

  revalidateEntityPaths();
}

/** Admin "Search & edit" page — direct edit of an existing record, no submission/queue involved. */
export async function adminUpdateDirect(kind: SubmissionKind, targetId: string, formData: FormData): Promise<void> {
  const payload = payloadFromFormData(formData);

  if (kind === "person") {
    const target = await getPersonById(targetId);
    const picture = await resolveImage("person", formData, target?.picture, targetId);
    await updatePerson(targetId, { ...(await toPersonPatch(payload)), picture });
  } else {
    const target = await getStartupById(targetId);
    const logo = await resolveImage("startup", formData, target?.logo, targetId);
    await updateStartup(targetId, { ...(await toStartupPatch(payload)), logo });
  }

  revalidateEntityPaths();
}

/** Admin "Search & edit" page — permanently removes a person/startup record and cleans up cross-references (founderIds / knownForStartupId) so deletion never leaves a dangling id behind. */
export async function adminDeleteEntity(kind: SubmissionKind, targetId: string): Promise<void> {
  if (kind === "person") {
    await deletePerson(targetId);
    const startups = await getStartups();
    for (const startup of startups) {
      if (startup.founderIds.includes(targetId)) {
        await updateStartup(startup.id, { founderIds: startup.founderIds.filter((id) => id !== targetId) });
      }
    }
  } else {
    await deleteStartup(targetId);
    const people = await getPeople();
    for (const person of people) {
      if (person.knownForStartupId === targetId) {
        await updatePerson(person.id, { knownForStartupId: undefined });
      }
    }
  }
  revalidateEntityPaths();
}
