"use client";

import { MockAuthToggle } from "@/components/community/mock-auth-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMockAuth } from "@/lib/mock-auth";
import { useState } from "react";

interface ComposerProps {
  titlePlaceholder?: string;
  bodyPlaceholder?: string;
  submitLabel?: string;
  onSubmit: (input: { title: string; body: string }) => void;
}

/** Reused for new posts (title+body) and replies (title omitted). */
export function Composer({
  titlePlaceholder,
  bodyPlaceholder = "Write something...",
  submitLabel = "Post",
  onSubmit,
}: ComposerProps) {
  const { isSignedIn } = useMockAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-border p-4">
        <p className="text-sm text-muted-foreground">Sign in to post.</p>
        <MockAuthToggle />
      </div>
    );
  }

  const canSubmit = body.trim() && (!titlePlaceholder || title.trim());

  return (
    <div className="space-y-2 rounded-xl border border-border p-4">
      {titlePlaceholder ? (
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={titlePlaceholder} />
      ) : null}
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={bodyPlaceholder} rows={3} />
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="accent"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit({ title: title.trim(), body: body.trim() });
            setTitle("");
            setBody("");
          }}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
