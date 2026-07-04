"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
        <Check className="size-4" />
        Thanks — we&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Your name" required />
        <Input type="email" placeholder="Your email" required />
      </div>
      <Textarea placeholder="How can we help?" rows={4} required />
      <Button type="submit" variant="accent">
        Send message
      </Button>
    </form>
  );
}
