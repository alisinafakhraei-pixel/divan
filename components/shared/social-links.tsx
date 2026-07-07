import { LinkedInIcon, XIcon, YouTubeIcon } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/divanacademy/posts/?feedView=all", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/@idearun", Icon: YouTubeIcon },
  { label: "X", href: "https://x.com/divanacademy", Icon: XIcon },
];

export function SocialLinks({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {SOCIALS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-foreground/60 transition-colors hover:text-foreground"
        >
          <Icon className={cn("size-5", iconClassName)} />
        </a>
      ))}
    </div>
  );
}
