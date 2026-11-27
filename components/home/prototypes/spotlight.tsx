"use client";

import { DivanMark } from "@/components/shared/divan-mark";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Thumb } from "@/components/shared/thumb";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Slide {
  key: string;
  label: string;
  title: string;
  blurb?: string;
  meta?: string;
  href: string;
  cta: string;
  external?: boolean;
  /** "story": photo backdrop. "profile": avatar on a gradient. "brand": Divan blue with the cube mark. */
  style: "story" | "profile" | "brand";
  image?: string;
  name?: string;
}

const AUTO_MS = 7000;

/** A big rotating spotlight with an "up next" list. Tap anything in the list to jump; it pauses while you hover. */
export function Spotlight({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % slides.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, slides.length]);

  const slide = slides[active];
  if (!slide) return null;
  const linkProps = slide.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Link
        href={slide.href}
        {...linkProps}
        key={slide.key}
        className={cn(
          "group relative flex min-h-[26rem] animate-in flex-col justify-end overflow-hidden rounded-3xl text-white duration-500 fade-in-0",
          slide.style === "brand" ? "bg-[#1c54d3]" : slide.style === "profile" ? "bg-gradient-to-br from-[#1c54d3] to-[#0f3590]" : "bg-foreground"
        )}
      >
        {slide.style === "story" ? (
          <>
            <Thumb src={slide.image} className="transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
          </>
        ) : null}
        {slide.style === "brand" ? <DivanMark className="pointer-events-none absolute -top-10 -right-10 size-[26rem] text-white/10" /> : null}
        {slide.style === "profile" ? (
          <>
            <DivanMark className="pointer-events-none absolute -right-16 -bottom-20 size-[24rem] text-white/10" />
            <EntityAvatar name={slide.name ?? slide.title} image={slide.image} className="absolute top-8 right-8 size-28 ring-4 ring-white/30 sm:size-36" />
          </>
        ) : null}
        <div className="relative max-w-2xl space-y-3 p-6 sm:p-9">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase ring-1 ring-white/25">{slide.label}</span>
          <p className="text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">{slide.title}</p>
          {slide.blurb ? <p className="line-clamp-3 text-white/80 sm:text-lg">{slide.blurb}</p> : null}
          {slide.meta ? <p className="text-sm text-white/60">{slide.meta}</p> : null}
          <span className="inline-flex items-center gap-1.5 pt-1 font-semibold">
            {slide.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <ol className="flex flex-col gap-2">
        {slides.map((s, i) => (
          <li key={s.key} className="flex-1">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative flex h-full w-full flex-col justify-center overflow-hidden rounded-2xl border p-4 text-left transition-colors",
                i === active ? "border-action-blue bg-accent/50" : "border-border bg-background hover:bg-muted"
              )}
            >
              <span className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{s.label}</span>
              <span className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">{s.title}</span>
              {i === active && !paused ? (
                <span key={`${active}-bar`} className="absolute bottom-0 left-0 h-0.5 w-full origin-left animate-[spotlight-bar_7s_linear_forwards] bg-action-blue" />
              ) : null}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
