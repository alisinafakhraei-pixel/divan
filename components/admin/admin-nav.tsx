"use client";

import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Community suggestions", href: "/admin" },
  { label: "Search & edit", href: "/admin/manage" },
  { label: "Add startup / entrepreneur", href: "/admin/add" },
  { label: "History", href: "/admin/history", icon: History },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin" || pathname.startsWith("/admin/suggestions")
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-1 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {link.icon ? <link.icon className="size-4" /> : null}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
