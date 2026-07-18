import { LinkedInIcon, XIcon } from "@/components/shared/social-icons";
import { VolunteerProfileHeader } from "@/components/shared/volunteer-profile-header";
import { getVolunteerBySlug, getVolunteers } from "@/lib/data-access/volunteers";
import { Globe } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const volunteer = getVolunteerBySlug(slug);
  if (!volunteer) return {};

  const title = `${volunteer.name} - ${volunteer.role} | Divan`;
  const description = volunteer.bio ?? `${volunteer.name} volunteers with Divan as ${volunteer.role}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const volunteer = getVolunteerBySlug(slug);
  if (!volunteer) notFound();

  const socialLinks = [
    volunteer.socials?.linkedin ? { label: "LinkedIn", href: volunteer.socials.linkedin, Icon: LinkedInIcon } : null,
    volunteer.socials?.x ? { label: "X", href: volunteer.socials.x, Icon: XIcon } : null,
    volunteer.socials?.website ? { label: "Website", href: volunteer.socials.website, Icon: Globe } : null,
  ].filter(Boolean) as { label: string; href: string; Icon: typeof Globe }[];

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <VolunteerProfileHeader volunteer={volunteer} />

      <div className="max-w-2xl space-y-8">
        {volunteer.bio ? (
          <div>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              About
            </h2>
            <p className="text-foreground">{volunteer.bio}</p>
          </div>
        ) : null}

        {socialLinks.length > 0 ? (
          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Connect
            </h2>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return getVolunteers().map((volunteer) => ({ slug: volunteer.slug }));
}
