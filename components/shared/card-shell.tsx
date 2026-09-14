import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardShellProps {
  href?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/** The site's boxy card treatment: white fill, hairline border, no shadow at rest, border→ink on hover. */
export function CardShell({ href, children, className, id }: CardShellProps) {
  const classes = cn(
    "block animate-in rounded-xl border border-border bg-card p-4 fade-in-0 slide-in-from-bottom-1 transition-all duration-300 ease-out sm:p-5",
    href && "hover:-translate-y-0.5 hover:border-foreground hover:shadow-md",
    className
  );

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a id={id} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link id={id} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <div id={id} className={classes}>
      {children}
    </div>
  );
}
