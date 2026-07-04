import { CTABanner } from "@/components/shared/cta-banner";
import { getCohortDisplayState, getCurrentCohort } from "@/lib/data-access/hackathon";

export function HackathonPromoBanner() {
  const cohort = getCurrentCohort();
  if (!cohort) return null;

  const display = getCohortDisplayState(cohort);

  if (display.state === "upcoming") {
    return (
      <CTABanner
        heading={`Divan Hackathon ${cohort.name} starts in ${display.daysUntilOpen} days`}
        description={`Theme: ${cohort.theme}. Applications open ${cohort.applicationsOpenAt}.`}
        ctaLabel="Learn more"
        ctaHref="/hackathon"
        variant="sky"
      />
    );
  }

  if (display.state === "applications-open") {
    return (
      <CTABanner
        heading={`Applications open for ${cohort.name}`}
        description={`Theme: ${cohort.theme}. ${display.daysUntilClose} days left to apply.`}
        ctaLabel="Apply now"
        ctaHref="/hackathon/apply"
        variant="ink"
      />
    );
  }

  return (
    <CTABanner
      heading={`${cohort.name} applications are closed`}
      description="See the recap — cohort stats, mentors, and finalists."
      ctaLabel="See recap"
      ctaHref={`/hackathon/cohorts/${cohort.slug}`}
      variant="sky"
    />
  );
}
