import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardShellProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

/** The site's boxy card treatment: white fill, hairline border, no shadow at rest, border→ink on hover. */
export function CardShell({ href, children, className }: CardShellProps) {
  const classes = cn(
    "block rounded-xl border border-border bg-card p-5 transition-colors",
    href && "hover:border-foreground",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
