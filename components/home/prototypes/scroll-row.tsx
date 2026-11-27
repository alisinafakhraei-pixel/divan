"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

/** A titled row of cards that scrolls sideways, with arrow buttons (Netflix-style). Children should have a fixed width. */
export function ScrollRow({ title, hint, href, cta, children }: { title: string; hint?: string; href?: string; cta?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.max(280, ref.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">{title}</h2>
          {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href ? (
            <Link href={href} className="mr-2 hidden items-center gap-1 text-sm font-medium text-action-blue hover:underline sm:inline-flex">
              {cta ?? "View all"} <ArrowRight className="size-3.5" />
            </Link>
          ) : null}
          <button type="button" aria-label="Scroll left" onClick={() => scroll(-1)} className="hidden size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted sm:flex">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Scroll right" onClick={() => scroll(1)} className="hidden size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted sm:flex">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="-mx-4 flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}
