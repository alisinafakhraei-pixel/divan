import { WhatsNewPanel } from "@/components/home/whats-new/panel";
import { WhatsNewTimeline } from "@/components/home/whats-new/timeline";
import { getActivityFeed } from "@/lib/data-access/activity";

/** Homepage "What's new": an explainer panel with live counters, then the last 7 days as a timeline. */
export async function WhatsNew() {
  const feed = await getActivityFeed();
  return (
    <section className="space-y-8">
      <WhatsNewPanel summary={feed.summary} />
      <WhatsNewTimeline feed={feed} />
    </section>
  );
}
