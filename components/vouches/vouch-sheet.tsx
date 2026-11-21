"use client";

import { submitVouch, type VouchState } from "@/app/actions/vouch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { VOUCH_RELATIONSHIPS } from "@/lib/types";
import { Check, ShieldCheck } from "lucide-react";
import { useActionState, useState } from "react";

const MAX = 280;

export function VouchSheet({ personId, personName }: { personId: string; personName: string }) {
  const firstName = personName.split(" ")[0];
  const [state, action, pending] = useActionState<VouchState, FormData>(submitVouch, { status: "idle" });
  const [length, setLength] = useState(0);
  const done = state.status === "published" || state.status === "pending";

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="accent" />}>
        <ShieldCheck />
        Vouch for {firstName}
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Vouch for {personName}</SheetTitle>
          <SheetDescription>
            One honest sentence about why you&apos;d back them. Your name and LinkedIn are shown, so readers know it&apos;s real.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          {done ? (
            <div className="flex items-start gap-2 rounded-xl border border-success bg-success/30 p-4 text-sm text-success-foreground">
              <Check className="mt-0.5 size-4 shrink-0" />
              {state.message}
            </div>
          ) : (
            <form action={action} className="space-y-4">
              <input type="hidden" name="personId" value={personId} />
              {/* Honeypot — hidden from people, tempting to bots. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              <div className="space-y-1.5">
                <Label htmlFor="voucherName">Your full name</Label>
                <Input id="voucherName" name="voucherName" required maxLength={80} autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="voucherLinkedIn">Your LinkedIn profile</Label>
                <Input
                  id="voucherLinkedIn"
                  name="voucherLinkedIn"
                  required
                  placeholder="linkedin.com/in/your-name"
                  inputMode="url"
                  autoComplete="url"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="relationship">How do you know {firstName}?</Label>
                <Select name="relationship" required>
                  <SelectTrigger id="relationship" className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {VOUCH_RELATIONSHIPS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Your vouch</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  minLength={20}
                  maxLength={MAX}
                  placeholder={`e.g. "I worked with ${firstName} for two years — the most reliable builder I know."`}
                  onChange={(e) => setLength(e.target.value.length)}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {length}/{MAX}
                </p>
              </div>
              {state.status === "error" ? <p className="text-sm text-destructive">{state.message}</p> : null}
              <Button type="submit" variant="accent" disabled={pending}>
                {pending ? "Checking..." : "Submit vouch"}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
