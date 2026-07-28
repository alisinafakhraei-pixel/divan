import { SocialLinks } from "@/components/shared/social-links";
import Link from "next/link";
import packageJson from "@/package.json";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "Entrepreneurs", href: "/entrepreneurs" },
      { label: "Startups", href: "/startups" },
      { label: "Ecosystem map", href: "/ecosystem-map" },
    ],
  },
  {
    heading: "Divan",
    links: [
      { label: "About", href: "/about" },
      { label: "Volunteers", href: "/volunteers" },
      { label: "Contribute", href: "/contribute" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <Link href="/" className="inline-flex items-center">
            <img src="/logo.svg" alt="Divan" className="h-8 w-auto" />
          </Link>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Meet Iranian entrepreneurs of the world.
          </p>
          <SocialLinks className="mt-4" />
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="text-sm font-semibold text-foreground">{col.heading}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Divan. v{packageJson.version}
      </div>
    </footer>
  );
}
