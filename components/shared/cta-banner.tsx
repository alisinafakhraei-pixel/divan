import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CTABannerProps {
  heading: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "ink" | "sky";
  className?: string;
}

export function CTABanner({
  heading,
  description,
  ctaLabel,
  ctaHref,
  variant = "ink",
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-xl px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10",
        variant === "ink" && "tile-dark",
        variant === "sky" && "bg-accent text-accent-foreground",
        className
      )}
    >
      <div>
        <p className="text-xl font-bold">{heading}</p>
        {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
      </div>
      <Button
        variant={variant === "ink" ? "accent" : "default"}
        render={<Link href={ctaHref} />}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
