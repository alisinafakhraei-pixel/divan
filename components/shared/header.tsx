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
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";

const primaryLinks = [
  { label: "Entrepreneurs", href: "/entrepreneurs" },
  { label: "Startups", href: "/startups" },
  { label: "News", href: "/news" },
  { label: "Insights", href: "/insights" },
  { label: "Hackathon", href: "/hackathon" },
  // Temporary — pulled from nav once all pages are built.
  { label: "Style guide", href: "/style-guide" },
];

const moreLinks = [
  { label: "Community", href: "/community/discussions" },
  { label: "Events", href: "/events" },
  { label: "Perks", href: "/perks" },
  { label: "About", href: "/about" },
  { label: "Contribute", href: "/contribute" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-foreground">
          Divan
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {primaryLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" render={<Link href={link.href} />}>
              {link.label}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm">
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

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Search" render={<Link href="/search" />}>
            <Search />
          </Button>
          <Button variant="outline" size="sm" className={cn("hidden sm:inline-flex")}>
            Sign in
          </Button>

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
