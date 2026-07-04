"use client";

import { MemberMiniProfile } from "@/components/community/member-mini-profile";
import { ThreadReplyList } from "@/components/community/thread-reply-list";
import { VoteControl } from "@/components/community/vote-control";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMemberById } from "@/lib/data-access/members";
import { getPostById } from "@/lib/data-access/discussions";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function DiscussionThreadPage() {
  const { id } = useParams<{ id: string }>();
  const post = getPostById(id);
  const [following, setFollowing] = useState(false);

  if (!post) notFound();

  const author = getMemberById(post.authorId);

  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-3">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{post.title}</h1>
        <div className="flex items-center justify-between">
          {author ? <MemberMiniProfile member={author} meta={post.createdAt} /> : null}
          <div className="flex items-center gap-2">
            <VoteControl initialCount={post.likes} variant="like" />
            <Button variant={following ? "outline" : "ghost"} size="sm" onClick={() => setFollowing((v) => !v)}>
              {following ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
        <p className="text-foreground">{post.body}</p>
      </div>

      <ThreadReplyList initialReplies={post.replies} />
    </div>
  );
}
