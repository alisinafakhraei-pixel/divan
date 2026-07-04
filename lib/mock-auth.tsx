"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface MockAuthState {
  isSignedIn: boolean;
  currentMemberId: string;
  toggleSignedIn: () => void;
}

const MockAuthContext = createContext<MockAuthState | null>(null);

/**
 * Stands in for real accounts until Community has a backend. State is in-memory only —
 * it resets on refresh, which is expected v1 behavior for this UI-only preview.
 */
export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <MockAuthContext.Provider
      value={{
        isSignedIn,
        currentMemberId: "mb-10",
        toggleSignedIn: () => setIsSignedIn((v) => !v),
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error("useMockAuth must be used within a MockAuthProvider");
  return ctx;
}
