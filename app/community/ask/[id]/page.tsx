"use client";

import { Composer } from "@/components/community/composer";
import { MemberMiniProfile } from "@/components/community/member-mini-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostById } from "@/lib/data-access/discussions";
import { getMemberById } from "@/lib/data-access/members";
import { useMockAuth } from "@/lib/mock-auth";
import type { Reply } from "@/lib/types";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import { ArrowBigUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = getPostById(id);
  const { isSignedIn, currentMemberId } = useMockAuth();
  const [answers, setAnswers] = useState<Reply[]>(post?.replies ?? []);
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries((post?.replies ?? []).map((r) => [r.id, r.votes]))
  );

  if (!post) notFound();

  const sortedAnswers = [...answers].sort((a, b) => (votes[b.id] ?? b.votes) - (votes[a.id] ?? a.votes));

  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-3">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{post.title}</h1>
        <p className="text-foreground">{post.body}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {sortedAnswers.length} {sortedAnswers.length === 1 ? "answer" : "answers"}
        </h2>

        {sortedAnswers.map((answer) => {
          const author = getMemberById(answer.authorId);
          const voteCount = votes[answer.id] ?? answer.votes;
          return (
            <div
              key={answer.id}
              className={cn(
                "space-y-2 rounded-xl border p-4",
                answer.isAccepted ? "border-success bg-success/30" : "border-border"
              )}
            >
              <div className="flex items-center justify-between">
                {author ? <MemberMiniProfile member={author} meta={answer.createdAt} /> : null}
                {answer.isAccepted ? (
                  <Badge variant="success">
                    <Check className="size-3" /> Accepted
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm text-foreground">{answer.body}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVotes((v) => ({ ...v, [answer.id]: (v[answer.id] ?? answer.votes) + 1 }))}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-foreground"
                >
                  <ArrowBigUp className="size-3.5" />
                  {voteCount}
                </button>
                {isSignedIn && !answer.isAccepted ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAnswers((prev) => prev.map((a) => ({ ...a, isAccepted: a.id === answer.id })))
                    }
                  >
                    Mark as accepted
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <Composer
        bodyPlaceholder="Write an answer..."
        submitLabel="Answer"
        onSubmit={({ body }) =>
          setAnswers((prev) => [
            ...prev,
            {
              id: `local-answer-${Date.now()}`,
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
