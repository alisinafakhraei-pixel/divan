"use client";

import { Composer } from "@/components/community/composer";
import { MemberMiniProfile } from "@/components/community/member-mini-profile";
import { VoteControl } from "@/components/community/vote-control";
import { getMemberById } from "@/lib/data-access/members";
import { useMockAuth } from "@/lib/mock-auth";
import type { Reply } from "@/lib/types";
import { useState } from "react";

export function ThreadReplyList({ initialReplies }: { initialReplies: Reply[] }) {
  const { currentMemberId } = useMockAuth();
  const [replies, setReplies] = useState(initialReplies);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </h2>

      <div className="space-y-4">
        {replies.map((reply) => {
          const author = getMemberById(reply.authorId);
          return (
            <div key={reply.id} className="space-y-2 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                {author ? <MemberMiniProfile member={author} /> : null}
                <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
              </div>
              <p className="text-sm text-foreground">{reply.body}</p>
              <VoteControl initialCount={reply.votes} variant="upvote" />
            </div>
          );
        })}
      </div>

      <Composer
        bodyPlaceholder="Write a reply..."
        submitLabel="Reply"
        onSubmit={({ body }) =>
          setReplies((prev) => [
            ...prev,
            {
              id: `local-reply-${Date.now()}`,
              authorId: currentMemberId,
              body,
              createdAt: new Date().toISOString().slice(0, 10),
              votes: 0,
            },
          ])
        }
      />
    </div>
  );
}
