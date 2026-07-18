"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const primaryLinks = [
  { label: "Entrepreneurs", href: "/entrepreneurs" },
  { label: "Startups", href: "/startups" },
  { label: "Ecosystem map", href: "/ecosystem-map" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
];

const moreLinks = [
  { label: "Hackathon", href: "/hackathon" },
  { label: "Events", href: "/events" },
  { label: "Volunteers", href: "/volunteers" },
  { label: "Admin", href: "/admin" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/logo.svg" alt="Divan" className="h-8 w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center gap-0.5 lg:flex">
          {primaryLinks.map((link) => (
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
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="whitespace-nowrap">
                  More <ChevronDown className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent>
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
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
