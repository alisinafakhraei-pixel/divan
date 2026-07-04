import { members } from "@/lib/data/members";
import type { Member } from "@/lib/types";

export function getMembers(): Member[] {
  return members;
}

export function getMemberById(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

/** The Divan team/contributor group shown on About — as distinct from community post authors. */
export function getTeamMembers(): Member[] {
  return members.filter((m) => m.role === "Admin" || m.role === "Moderator" || m.role === "Contributor");
}
