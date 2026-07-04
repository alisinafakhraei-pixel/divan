"use client";

import { Composer } from "@/components/community/composer";
import { DiscussionCard } from "@/components/shared/discussion-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPosts } from "@/lib/data-access/discussions";
import { useMockAuth } from "@/lib/mock-auth";
import type { Post } from "@/lib/types";
import { useMemo, useState } from "react";

export default function DiscussionsPage() {
  const { currentMemberId } = useMockAuth();
  const [extraPosts, setExtraPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<"recent" | "top">("recent");

  const posts = useMemo(() => {
    const all = [...extraPosts, ...getPosts("discussion")];
    return sort === "top" ? [...all].sort((a, b) => b.likes - a.likes) : all;
  }, [extraPosts, sort]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading as="h1" bold="Community" muted="discussions" />
        <div className="flex gap-1 rounded-full border border-border p-1 text-sm">
          <button
            className={`rounded-full px-3 py-1 ${sort === "recent" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setSort("recent")}
          >
            Recent
          </button>
          <button
            className={`rounded-full px-3 py-1 ${sort === "top" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setSort("top")}
          >
            Top
          </button>
        </div>
      </div>

      <Composer
        titlePlaceholder="Discussion title"
        bodyPlaceholder="What's on your mind?"
        submitLabel="Start discussion"
        onSubmit={({ title, body }) =>
          setExtraPosts((prev) => [
            {
              id: `local-${Date.now()}`,
              postType: "discussion",
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

      {posts.length === 0 ? (
        <EmptyState title="No discussions yet" description="Be the first to start one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <DiscussionCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
