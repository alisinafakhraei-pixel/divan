"use client";

import { Composer } from "@/components/community/composer";
import { DiscussionCard } from "@/components/shared/discussion-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPosts } from "@/lib/data-access/discussions";
import { useMockAuth } from "@/lib/mock-auth";
import type { Post } from "@/lib/types";
import { useMemo, useState } from "react";

export default function AskCommunityPage() {
  const { currentMemberId } = useMockAuth();
  const [extraPosts, setExtraPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered">("all");

  const questions = useMemo(() => {
    const all = [...extraPosts, ...getPosts("question")];
    if (filter === "answered") return all.filter((q) => q.replies.some((r) => r.isAccepted));
    if (filter === "unanswered") return all.filter((q) => !q.replies.some((r) => r.isAccepted));
    return all;
  }, [extraPosts, filter]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading as="h1" bold="Ask the" muted="community" />
        <div className="flex gap-1 rounded-full border border-border p-1 text-sm">
          {(["all", "answered", "unanswered"] as const).map((f) => (
            <button
              key={f}
              className={`rounded-full px-3 py-1 capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Composer
        titlePlaceholder="Your question"
        bodyPlaceholder="Add more detail..."
        submitLabel="Ask"
        onSubmit={({ title, body }) =>
          setExtraPosts((prev) => [
            {
              id: `local-${Date.now()}`,
              postType: "question",
              title,
              body,
              category: "General",
              tags: [],
              authorId: currentMemberId,
              createdAt: new Date().toISOString().slice(0, 10),
              likes: 0,
              replies: [],
            },
            ...prev,
          ])
        }
      />

      {questions.length === 0 ? (
        <EmptyState title="No questions found" description="Try a different filter, or ask the first one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((post) => (
            <DiscussionCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
