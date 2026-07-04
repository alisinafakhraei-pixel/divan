import { MockAuthToggle } from "@/components/community/mock-auth-toggle";
import { ModerationBanner } from "@/components/community/moderation-banner";
import { Button } from "@/components/ui/button";
import { MockAuthProvider } from "@/lib/mock-auth";
import Link from "next/link";
import type { ReactNode } from "react";

const TABS = [
  { label: "Discussions", href: "/community/discussions" },
  { label: "Ask the Community", href: "/community/ask" },
  { label: "Job Market", href: "/community/jobs" },
];

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <MockAuthProvider>
      <div className="mx-auto max-w-[1200px] space-y-6 px-4 pt-8 sm:px-6">
        <ModerationBanner />
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <Button key={tab.href} variant="ghost" size="sm" render={<Link href={tab.href} />}>
                {tab.label}
              </Button>
            ))}
          </nav>
          <MockAuthToggle />
        </div>
      </div>
      {children}
    </MockAuthProvider>
  );
}
