import { members } from "@/lib/data/members";
import type { Member } from "@/lib/types";

export function getMembers(): Member[] {
  return members;
}

export function getMemberById(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}
