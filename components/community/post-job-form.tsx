"use client";

import { MockAuthToggle } from "@/components/community/mock-auth-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMockAuth } from "@/lib/mock-auth";
import type { Job } from "@/lib/types";
import { useState } from "react";

type NewJob = Pick<Job, "title" | "companyName" | "location" | "description" | "applyLink">;

export function PostJobForm({ onSubmit }: { onSubmit: (job: NewJob) => void }) {
  const { isSignedIn } = useMockAuth();
  const [form, setForm] = useState<NewJob>({
    title: "",
    companyName: "",
    location: "",
    description: "",
    applyLink: "",
  });

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-border p-4">
        <p className="text-sm text-muted-foreground">Sign in to post a job.</p>
        <MockAuthToggle />
      </div>
    );
  }

  const canSubmit = form.title.trim() && form.companyName.trim() && form.location.trim();

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Job title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <Input
          placeholder="Company name"
          value={form.companyName}
          onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
        />
        <Input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
        <Input
          placeholder="Apply link (optional)"
          value={form.applyLink}
          onChange={(e) => setForm((f) => ({ ...f, applyLink: e.target.value }))}
        />
      </div>
      <Textarea
        placeholder="Job description"
        rows={3}
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="accent"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit(form);
            setForm({ title: "", companyName: "", location: "", description: "", applyLink: "" });
          }}
        >
          Post job
        </Button>
      </div>
    </div>
  );
}
