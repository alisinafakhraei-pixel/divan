import { readCollection, writeCollection } from "@/lib/server/collection-store";
import type { Vouch } from "@/lib/types";

const FILE = "data/vouches.json";

async function all(): Promise<Vouch[]> {
  return readCollection<Vouch>(FILE);
}

/** Newest first. */
export async function getPublicVouches(personId: string): Promise<Vouch[]> {
  return (await all())
    .filter((v) => v.personId === personId && v.status === "public")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getVouchCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const v of await all()) {
    if (v.status === "public") counts[v.personId] = (counts[v.personId] ?? 0) + 1;
  }
  return counts;
}

export async function getPendingVouches(): Promise<Vouch[]> {
  return (await all()).filter((v) => v.status === "pending");
}

export async function findDuplicateVouch(personId: string, voucherLinkedIn: string): Promise<Vouch | undefined> {
  return (await all()).find(
    (v) => v.personId === personId && v.voucherLinkedIn === voucherLinkedIn && v.status !== "rejected"
  );
}

export async function addVouch(vouch: Vouch): Promise<void> {
  const vouches = await all();
  vouches.push(vouch);
  await writeCollection(FILE, vouches, `New vouch (${vouch.status})`);
}

export async function setVouchStatus(id: string, status: Vouch["status"]): Promise<Vouch | undefined> {
  const vouches = await all();
  const vouch = vouches.find((v) => v.id === id);
  if (!vouch) return undefined;
  vouch.status = status;
  vouch.moderation = "admin";
  await writeCollection(FILE, vouches, `Vouch ${status}: ${id}`);
  return vouch;
}

export interface PersonStanding {
  personId: string;
  count: number;
}
export interface VoucherStanding {
  name: string;
  linkedIn: string;
  count: number;
}

/** Rankings built from public vouches only: who is vouched for most, and who vouches most. */
export async function getLeaderboards(limit = 10): Promise<{ mostVouched: PersonStanding[]; topVouchers: VoucherStanding[]; total: number }> {
  const vouches = (await all()).filter((v) => v.status === "public");

  const received = new Map<string, number>();
  const given = new Map<string, VoucherStanding>();
  for (const v of vouches) {
    received.set(v.personId, (received.get(v.personId) ?? 0) + 1);
    const prev = given.get(v.voucherLinkedIn);
    given.set(v.voucherLinkedIn, { name: prev?.name ?? v.voucherName, linkedIn: v.voucherLinkedIn, count: (prev?.count ?? 0) + 1 });
  }

  return {
    mostVouched: [...received].map(([personId, count]) => ({ personId, count })).sort((a, b) => b.count - a.count).slice(0, limit),
    topVouchers: [...given.values()].sort((a, b) => b.count - a.count).slice(0, limit),
    total: vouches.length,
  };
}

export async function getRecentVouches(limit = 6): Promise<Vouch[]> {
  return (await all())
    .filter((v) => v.status === "public")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : b.id.localeCompare(a.id)))
    .slice(0, limit);
}
