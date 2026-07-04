import { CardShell } from "@/components/shared/card-shell";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Badge } from "@/components/ui/badge";
import { getMemberById } from "@/lib/data-access/members";
import type { Post } from "@/lib/types";

export function DiscussionCard({ post }: { post: Post }) {
  const author = getMemberById(post.authorId);
  const base = post.postType === "question" ? "/community/ask" : "/community/discussions";
  // Locally-composed posts aren't persisted anywhere a detail route could look them up.
  const isLocal = post.id.startsWith("local-");

  return (
    <CardShell href={isLocal ? undefined : `${base}/${post.id}`}>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="text-xs text-muted-foreground">
          {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
        </span>
      </div>
      <p className="mt-3 font-semibold text-foreground">{post.title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
      <div className="mt-4 flex items-center gap-2">
        <EntityAvatar name={author?.name ?? "Member"} image={author?.avatar} size="sm" />
        <span className="text-xs text-muted-foreground">{author?.name ?? "Member"}</span>
        <span className="ml-auto text-xs text-muted-foreground">{post.likes} likes</span>
      </div>
    </CardShell>
  );
}
