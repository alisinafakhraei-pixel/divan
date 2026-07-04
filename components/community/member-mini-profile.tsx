import { EntityAvatar } from "@/components/shared/entity-avatar";
import type { Member } from "@/lib/types";

export function MemberMiniProfile({ member, meta }: { member: Member; meta?: string }) {
  return (
    <div className="flex items-center gap-2">
      <EntityAvatar name={member.name} image={member.avatar} size="sm" />
      <div>
        <p className="text-sm font-medium text-foreground">{member.name}</p>
        <p className="text-xs text-muted-foreground">{meta ?? member.role}</p>
      </div>
    </div>
  );
}
