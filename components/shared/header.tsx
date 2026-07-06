"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const allLinks = [
  { label: "Entrepreneurs", href: "/entrepreneurs" },
  { label: "Startups", href: "/startups" },
  { label: "Ecosystem map", href: "/ecosystem-map" },
  { label: "Hackathon", href: "/hackathon" },
  { label: "Community", href: "/community/discussions" },
  { label: "Events", href: "/events" },
  { label: "Perks", href: "/perks" },
  { label: "About", href: "/about" },
  { label: "Contribute", href: "/contribute" },
];

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex min-h-16 max-w-[1200px] flex-wrap items-center gap-y-1 gap-x-6 px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="Divan" className="h-8 w-auto" />
        </Link>

        <nav className="hidden flex-1 flex-wrap items-center gap-0.5 lg:flex">
          {allLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              className="whitespace-nowrap"
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="flex items-center"
            >
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  if (!query) setSearchOpen(false);
                }}
                placeholder="Search entrepreneurs, startups, news..."
                className="h-9 w-40 origin-right animate-in duration-200 fade-in-0 zoom-in-95 sm:w-56"
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Open menu" className="lg:hidden" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Divan</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {allLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={<Link href={link.href} />}
                    nativeButton={false}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
