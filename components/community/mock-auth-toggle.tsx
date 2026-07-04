"use client";

import { Button } from "@/components/ui/button";
import { useMockAuth } from "@/lib/mock-auth";

export function MockAuthToggle() {
  const { isSignedIn, toggleSignedIn } = useMockAuth();

  return (
    <Button variant={isSignedIn ? "outline" : "accent"} size="sm" onClick={toggleSignedIn}>
      {isSignedIn ? "Sign out (mock)" : "Sign in (mock)"}
    </Button>
  );
}
