import type { HomeData } from "@/components/home/prototypes/types";
import { getActivityFeed } from "@/lib/data-access/activity";
import { getNews } from "@/lib/data-access/news";
import { getFeaturedPeople, getPeople } from "@/lib/data-access/people";
import { getSiteStats } from "@/lib/data-access/stats";
import { getFeaturedStartups, getStartups } from "@/lib/data-access/startups";
import { getVouchCounts } from "@/lib/data-access/vouches";

/** Loads everything the homepage designs draw on. */
export async function loadHomeData(): Promise<HomeData> {
  const [stats, featuredPeople, featuredStartups, allPeople, allStartups, news, vouchCounts, feed] = await Promise.all([
    getSiteStats(),
    getFeaturedPeople(9),
    getFeaturedStartups(6),
    getPeople(),
    getStartups(),
    getNews(),
    getVouchCounts(),
    getActivityFeed(),
  ]);

  return {
    heroStats: [
      { label: "Entrepreneurs", value: stats.totalEntrepreneurs },
      { label: "Startups", value: stats.totalStartups },
      { label: "Countries", value: stats.countriesRepresented },
      { label: "Tracked valuation", value: stats.combinedTrackedValuation },
    ],
    featuredPeople,
    featuredStartups,
    allPeople,
    allStartups,
    news,
    feed,
    vouchCounts,
  };
}
