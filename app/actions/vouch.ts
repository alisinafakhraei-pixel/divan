"use server";

import { VOUCHES_ENABLED } from "@/lib/features";
import { getPersonById } from "@/lib/data-access/people";
import { addVouch, findDuplicateVouch, setVouchStatus } from "@/lib/data-access/vouches";
import { moderateVouch } from "@/lib/server/vouch-moderator";
import { createClient } from "@/lib/supabase/server";
import { VOUCH_RELATIONSHIPS, type Vouch, type VouchRelationship } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type VouchState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "published" | "pending"; message: string };

// Light per-instance throttle (5 vouches/hour per visitor) on top of the duplicate check and AI moderation.
const recent = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(key, hits);
    return true;
  }
  recent.set(key, [...hits, now]);
  return false;
}

function normalizeLinkedIn(raw: string): string | null {
  try {
    const url = new URL(raw.trim().startsWith("http") ? raw.trim() : `https://${raw.trim()}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const match = url.pathname.match(/^\/in\/([^/]+)/i);
    if (host !== "linkedin.com" || !match) return null;
    return `https://www.linkedin.com/in/${decodeURIComponent(match[1]).toLowerCase()}`;
  } catch {
    return null;
  }
}

const clean = (v: FormDataEntryValue | null): string => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

export async function submitVouch(_prev: VouchState, formData: FormData): Promise<VouchState> {
  if (!VOUCHES_ENABLED) return { status: "error", message: "Vouching is paused for now." };

  // Honeypot: real visitors never see or fill this field.
  if (clean(formData.get("website"))) return { status: "published", message: "Thanks — your vouch is live." };

  const personId = clean(formData.get("personId"));
  const voucherName = clean(formData.get("voucherName"));
  const linkedIn = normalizeLinkedIn(clean(formData.get("voucherLinkedIn")));
  const relationship = clean(formData.get("relationship")) as VouchRelationship;
  const message = clean(formData.get("message"));

  const person = await getPersonById(personId);
  if (!person) return { status: "error", message: "We couldn't find that profile." };
  if (voucherName.length < 2 || voucherName.length > 80) return { status: "error", message: "Please enter your full name." };
  if (!linkedIn) return { status: "error", message: "Add your LinkedIn profile link (linkedin.com/in/your-name) so readers can see you're real." };
  if (!VOUCH_RELATIONSHIPS.includes(relationship)) return { status: "error", message: "Pick how you know them." };
  if (message.length < 20) return { status: "error", message: "Write at least a sentence (20+ characters)." };
  if (message.length > 280) return { status: "error", message: "Keep it under 280 characters." };

  const ownLinks = person.additionalInfo.map((l) => normalizeLinkedIn(l.url)).filter(Boolean);
  if (ownLinks.includes(linkedIn) || voucherName.toLowerCase() === person.name.toLowerCase()) {
    return { status: "error", message: "You can't vouch for yourself." };
  }
  if (await findDuplicateVouch(person.id, linkedIn)) {
    return { status: "error", message: "You've already vouched for this person." };
  }

  const requestHeaders = await headers();
  const visitor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (throttled(visitor)) return { status: "error", message: "Too many vouches in a short time — try again later." };

  const verdict = await moderateVouch({ personName: person.name, voucherName, relationship, message });
  const vouch: Vouch = {
    id: `vouch-${Date.now()}`,
    personId: person.id,
    voucherName,
    voucherLinkedIn: linkedIn,
    relationship,
    message,
    createdAt: new Date().toISOString().slice(0, 10),
    status: verdict.verdict === "approve" ? "public" : "pending",
    moderation: verdict.verdict === "approve" ? "auto" : undefined,
    moderationNote: verdict.reason,
  };
  await addVouch(vouch);

  revalidatePath(`/entrepreneurs/${person.slug}`);
  revalidatePath("/admin/vouches");
  return vouch.status === "public"
    ? { status: "published", message: `Thanks — your vouch for ${person.name} is live.` }
    : { status: "pending", message: "Thanks — your vouch is in a quick review and will appear once approved." };
}

async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorised");
}

export async function reviewVouch(id: string, decision: "public" | "rejected"): Promise<void> {
  await requireAdmin();
  const vouch = await setVouchStatus(id, decision);
  if (vouch) {
    const person = await getPersonById(vouch.personId);
    if (person) revalidatePath(`/entrepreneurs/${person.slug}`);
  }
  revalidatePath("/admin/vouches");
}
